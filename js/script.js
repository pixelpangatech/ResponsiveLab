document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const iframe = document.getElementById('preview-frame');
    const iframeContainer = document.getElementById('iframe-container');
    const currentResLabel = document.getElementById('current-res');
    const scaleValueLabel = document.getElementById('scale-value');
    const downloadBtn = document.getElementById('download-btn');
    const toast = document.getElementById('toast');
    const sidebar = document.querySelector('.sidebar');

    // Modal elements
    const addCustomBtn = document.getElementById('add-custom-btn');
    const customModal = document.getElementById('custom-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelModal = document.getElementById('cancel-modal');
    const customSizeForm = document.getElementById('custom-size-form');

    let currentWidth = 390;
    let currentHeight = 844;
    let currentUrl = '';

    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Load custom sizes from localStorage
    loadCustomSizes();

    // Hide loader when iframe finishes loading
    iframe.addEventListener('load', () => {
        loadingOverlay.classList.add('hidden');
    });

    // Handle URL Submission
    urlForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let url = urlInput.value.trim();
        
        if (url) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
                urlInput.value = url;
            }
            currentUrl = url;
            
            // Show loader
            loadingOverlay.classList.remove('hidden');
            
            // Always use corsproxy.io to bypass X-Frame-Options silently
            iframe.src = `https://corsproxy.io/?${encodeURIComponent(currentUrl)}`;
            updateScale();
        }
    });

    // Handle Device Selection (Event Delegation)
    sidebar.addEventListener('click', (e) => {
        const btn = e.target.closest('.device-btn');
        if (!btn) return;

        // Remove active class from all
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        // Add to clicked
        btn.classList.add('active');

        // Update dimensions
        currentWidth = parseInt(btn.dataset.width);
        currentHeight = parseInt(btn.dataset.height);

        updateIframeDimensions();
    });

    const rotateBtn = document.getElementById('rotate-btn');
    if(rotateBtn) {
        rotateBtn.addEventListener('click', () => {
            // Swap width and height for landscape/portrait
            let temp = currentWidth;
            currentWidth = currentHeight;
            currentHeight = temp;
            
            updateIframeDimensions();
        });
    }

    function updateIframeDimensions() {
        iframeContainer.style.width = `${currentWidth}px`;
        iframeContainer.style.height = `${currentHeight}px`;
        currentResLabel.textContent = `${currentWidth} x ${currentHeight}`;
        updateScale();
    }

    // Scale iframe container to fit screen if it's too large
    function updateScale() {
        const wrapper = document.querySelector('.iframe-wrapper');
        const padding = 40; // 20px padding on each side
        
        const availableWidth = wrapper.clientWidth - padding;
        const availableHeight = wrapper.clientHeight - padding;

        let scale = 1;

        if (currentWidth > availableWidth || currentHeight > availableHeight) {
            const scaleX = availableWidth / currentWidth;
            const scaleY = availableHeight / currentHeight;
            scale = Math.min(scaleX, scaleY);
        }

        // Apply scale transform
        if (scale < 1) {
            iframeContainer.style.transform = `scale(${scale})`;
            scaleValueLabel.textContent = `${Math.round(scale * 100)}%`;
        } else {
            iframeContainer.style.transform = `scale(1)`;
            scaleValueLabel.textContent = `100%`;
        }
    }

    window.addEventListener('resize', updateScale);
    setTimeout(updateScale, 100);

    // Modal Logic
    addCustomBtn.addEventListener('click', () => customModal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => customModal.classList.add('hidden'));
    cancelModal.addEventListener('click', () => customModal.classList.add('hidden'));

    customSizeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const categoryId = document.getElementById('custom-cat').value;
        const label = document.getElementById('custom-label').value;
        const width = document.getElementById('custom-width').value;
        const height = document.getElementById('custom-height').value;

        const newSize = { categoryId, label, width, height };

        // Save to localStorage
        const customSizes = JSON.parse(localStorage.getItem('customSizes') || '[]');
        customSizes.push(newSize);
        localStorage.setItem('customSizes', JSON.stringify(customSizes));

        // Add to UI
        addDeviceButtonToCategory(newSize);

        // Reset and close
        customSizeForm.reset();
        customModal.classList.add('hidden');
        showToast('Custom size added!');
    });

    function loadCustomSizes() {
        const customSizes = JSON.parse(localStorage.getItem('customSizes') || '[]');
        customSizes.forEach(size => addDeviceButtonToCategory(size));
    }

    function addDeviceButtonToCategory(size) {
        const categoryDiv = document.getElementById(size.categoryId);
        if (!categoryDiv) return;

        const btn = document.createElement('button');
        btn.className = 'device-btn custom-device';
        btn.dataset.width = size.width;
        btn.dataset.height = size.height;
        btn.textContent = `${size.width} x ${size.height} (${size.label})`;
        
        categoryDiv.appendChild(btn);
    }

    function showToast(message, isSuccess = true) {
        toast.textContent = message;
        toast.className = 'toast show';
        
        if (isSuccess) {
            toast.classList.add('success');
        }
        
        setTimeout(() => {
            toast.className = 'toast hidden';
        }, 3000);
    }
});
