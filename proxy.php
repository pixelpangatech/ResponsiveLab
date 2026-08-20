<?php
// proxy.php
header('Access-Control-Allow-Origin: *');

$url = '';
if (isset($_SERVER['PATH_INFO']) && strlen($_SERVER['PATH_INFO']) > 1) {
    $url = ltrim($_SERVER['PATH_INFO'], '/');
    if (!empty($_SERVER['QUERY_STRING'])) {
        $url .= '?' . $_SERVER['QUERY_STRING'];
    }
} elseif (isset($_GET['url'])) {
    $url = $_GET['url'];
}

if (empty($url)) {
    die("Error: No URL provided");
}

if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
    $url = "https://" . $url;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);

if ($response === false) {
    die("Error: Failed to load URL. cURL Error: " . curl_error($ch));
}

$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header_text = substr($response, 0, $header_size);
$body = substr($response, $header_size);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($content_type) {
    header('Content-Type: ' . $content_type);
}

// Only inject scripts and base tags if the response is HTML
if (stripos($content_type, 'text/html') !== false || empty($content_type)) {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $script_path = $_SERVER['SCRIPT_NAME']; 
    
    $parsed_url = parse_url($url);
    $target_base = $parsed_url['scheme'] . '://' . $parsed_url['host'];
    if (isset($parsed_url['path'])) {
        if (substr($parsed_url['path'], -1) === '/') {
            $dir = $parsed_url['path'];
        } else {
            $dir = str_replace('\\', '/', dirname($parsed_url['path']));
        }
        $target_base .= rtrim($dir, '/') . '/';
    } else {
        $target_base .= '/';
    }
    
    $proxy_base = $protocol . '://' . $host . $script_path . '/' . $target_base;
    $base_tag = "<base href=\"$proxy_base\">";

    $sync_script = <<<SCRIPT
    <script>
        let isProgrammaticScroll = false;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (isProgrammaticScroll) return;
            
            const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
            const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
            
            window.top.postMessage({
                type: 'RESPONSIVELAB_SCROLL',
                scrollRatioX: maxScrollX > 0 ? window.scrollX / maxScrollX : 0,
                scrollRatioY: maxScrollY > 0 ? window.scrollY / maxScrollY : 0
            }, '*');
        });

        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'RESPONSIVELAB_SCROLL') {
                if (e.source !== window.top) return;

                isProgrammaticScroll = true;
                const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
                const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
                
                window.scrollTo({
                    left: e.data.scrollRatioX * maxScrollX,
                    top: e.data.scrollRatioY * maxScrollY,
                    behavior: 'auto'
                });
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isProgrammaticScroll = false;
                }, 50);
            }
        });
    </script>
SCRIPT;

    // Remove any existing base tags from the HTML to prevent conflicts
    $body = preg_replace('/<base[^>]*>/i', '', $body);

    if (stripos($body, '<head>') !== false) {
        $body = preg_replace('/<head>/i', '<head>' . $base_tag . $sync_script, $body, 1);
    } else {
        $body = $base_tag . $sync_script . $body;
    }
}

echo $body;
?>
