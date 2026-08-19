document.addEventListener('DOMContentLoaded', () => {
    const urlForm = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const downloadBtn = document.getElementById('download-btn');
    const toast = document.getElementById('toast');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-open');
        sidebarOverlay.classList.toggle('active');
    }

    mobileMenuBtn.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', toggleSidebar);
    }

    // Modal elements
    const addCustomBtn = document.getElementById('add-custom-btn');
    const customModal = document.getElementById('custom-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelModal = document.getElementById('cancel-modal');
    const customSizeForm = document.getElementById('custom-size-form');

    const qrBtn = document.getElementById('qr-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const qrModal = document.getElementById('qr-modal');
    const closeQrModal = document.getElementById('close-qr-modal');
    const qrImage = document.getElementById('qr-image');
    const qrPlaceholder = document.getElementById('qr-placeholder');

    // Theme Toggle Logic
    const savedTheme = localStorage.getItem('responsiveLabTheme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('responsiveLabTheme', 'dark');
            showToast('Switched to Dark Mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('responsiveLabTheme', 'light');
            showToast('Switched to Light Mode');
        }
    });

    // QR Code Logic
    qrBtn.addEventListener('click', () => {
        qrModal.classList.remove('hidden');
        if (currentUrl) {
            qrPlaceholder.style.display = 'none';
            qrImage.style.display = 'block';
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
        } else {
            qrPlaceholder.style.display = 'block';
            qrImage.style.display = 'none';
        }
    });

    closeQrModal.addEventListener('click', () => {
        qrModal.classList.add('hidden');
    });

    const devicesGrid = document.getElementById('devices-grid');
    let currentUrl = '';

    // Load custom sizes from localStorage
    loadCustomSizes();

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
            
            // Update all active iframes
            const iframes = devicesGrid.querySelectorAll('.preview-frame');
            const overlays = devicesGrid.querySelectorAll('.loading-overlay');
            
            iframes.forEach((iframe, index) => {
                overlays[index].classList.remove('hidden');
                iframe.src = `https://corsproxy.io/?${encodeURIComponent(currentUrl)}`;
            });
            
            updateAllScales();
        }
    });

    // Add Device Function
    function addDevice(width, height, label) {
        const isDesktop = width >= 1024;
        const frameClass = isDesktop ? 'device-frame desktop-frame' : 'device-frame';

        const wrapper = document.createElement('div');
        wrapper.className = 'device-wrapper';
        wrapper.dataset.width = width;
        wrapper.dataset.height = height;

        wrapper.innerHTML = `
            <div class="device-header">
                <span>${label} (${width}x${height})</span>
                <button class="remove-device-btn" title="Remove Device">&times;</button>
            </div>
            <div class="${frameClass}" style="width: ${width}px; height: ${height}px; position: relative;">
                <iframe class="preview-frame" src="about:blank" frameborder="0" style="width: 100%; height: 100%;"></iframe>
                <div class="loading-overlay hidden"><div class="spinner"></div></div>
            </div>
            <div class="zoom-controls" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 5px;">Scale: <span class="scale-value">100%</span></div>
        `;

        const iframe = wrapper.querySelector('.preview-frame');
        const loadingOverlay = wrapper.querySelector('.loading-overlay');
        const removeBtn = wrapper.querySelector('.remove-device-btn');

        iframe.addEventListener('load', () => {
            if (iframe.src !== 'about:blank') {
                loadingOverlay.classList.add('hidden');
            }
        });

        removeBtn.addEventListener('click', () => {
            wrapper.remove();
        });

        devicesGrid.appendChild(wrapper);

        if (currentUrl) {
            loadingOverlay.classList.remove('hidden');
            iframe.src = `https://corsproxy.io/?${encodeURIComponent(currentUrl)}`;
        }

        updateAllScales();
    }

    // Handle Device Selection (Event Delegation)
    sidebar.addEventListener('click', (e) => {
        const btn = e.target.closest('.device-btn');
        if (!btn) return;

        const width = parseInt(btn.dataset.width);
        const height = parseInt(btn.dataset.height);
        const label = btn.textContent.trim();

        addDevice(width, height, label);

        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    });

    function updateAllScales() {
        const wrappers = document.querySelectorAll('.device-wrapper');
        wrappers.forEach(wrapper => {
            const width = parseInt(wrapper.dataset.width);
            const height = parseInt(wrapper.dataset.height);
            const frame = wrapper.querySelector('.device-frame');
            const scaleLabel = wrapper.querySelector('.scale-value');
            
            // Calculate scale based on container height (we want them to fit vertically)
            const availableHeight = devicesGrid.clientHeight - 100; // padding
            
            let scale = 1;
            if (height > availableHeight) {
                scale = availableHeight / height;
            }

            if (scale < 1) {
                frame.style.transform = `scale(${scale})`;
                frame.style.transformOrigin = 'top center';
                
                // Adjust margin bottom so flex container knows the actual scaled height
                const scaledHeight = height * scale;
                const gap = height - scaledHeight;
                frame.style.marginBottom = `-${gap}px`;
                
                scaleLabel.textContent = `${Math.round(scale * 100)}%`;
            } else {
                frame.style.transform = 'none';
                frame.style.marginBottom = '0px';
                scaleLabel.textContent = '100%';
            }
        });
    }

    window.addEventListener('resize', updateAllScales);

    // Initial load: Add one default device
    addDevice(390, 844, 'iPhone 13');
    setTimeout(updateAllScales, 100);

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
