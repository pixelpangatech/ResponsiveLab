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
                iframe.src = `proxy.php?url=${encodeURIComponent(currentUrl)}`;
            });
            
            updateAllScales();
            updateURLState();
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
            updateURLState();
            updateAllScales();
        });

        devicesGrid.appendChild(wrapper);

        if (currentUrl) {
            loadingOverlay.classList.remove('hidden');
            iframe.src = `proxy.php?url=${encodeURIComponent(currentUrl)}`;
        }

        updateAllScales();
        updateURLState();
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

    // Handle Scroll Sync from Proxy
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'RESPONSIVELAB_SCROLL') {
            const iframes = document.querySelectorAll('.preview-frame');
            iframes.forEach(iframe => {
                // Relay to all iframes except the sender
                if (iframe.contentWindow !== e.source) {
                    iframe.contentWindow.postMessage(e.data, '*');
                }
            });
        }
    });

    function updateURLState() {
        const wrappers = document.querySelectorAll('.device-wrapper');
        const devices = [];
        wrappers.forEach(w => {
            devices.push(`${w.dataset.width}x${w.dataset.height}`);
        });
        
        const params = new URLSearchParams();
        if (currentUrl) params.set('url', currentUrl);
        if (devices.length > 0) params.set('devices', devices.join(','));
        
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newUrl);
    }

    function parseURLParams() {
        const params = new URLSearchParams(window.location.search);
        const url = params.get('url');
        const devicesParam = params.get('devices');
        
        if (url) {
            urlInput.value = url;
            currentUrl = url;
        }
        
        if (devicesParam) {
            const deviceList = devicesParam.split(',');
            deviceList.forEach(dev => {
                const parts = dev.split('x');
                if (parts.length === 2) {
                    addDevice(parseInt(parts[0]), parseInt(parts[1]), 'Device');
                }
            });
        } else {
            // Initial load: Add one default device
            addDevice(390, 844, 'iPhone 13');
        }
    }

    // Load state from URL
    parseURLParams();
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

    // Workspaces Logic
    const saveWorkspaceBtn = document.getElementById('save-workspace-btn');
    const workspaceModal = document.getElementById('workspace-modal');
    const closeWorkspaceModal = document.getElementById('close-workspace-modal');
    const cancelWorkspaceModal = document.getElementById('cancel-workspace-modal');
    const workspaceForm = document.getElementById('workspace-form');
    const workspacesList = document.getElementById('workspaces-list');

    loadWorkspaces();

    saveWorkspaceBtn.addEventListener('click', () => {
        const wrappers = document.querySelectorAll('.device-wrapper');
        if (wrappers.length === 0) {
            showToast('No devices in grid to save!', false);
            return;
        }
        workspaceModal.classList.remove('hidden');
    });

    closeWorkspaceModal.addEventListener('click', () => workspaceModal.classList.add('hidden'));
    cancelWorkspaceModal.addEventListener('click', () => workspaceModal.classList.add('hidden'));

    workspaceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('workspace-name').value;
        const wrappers = document.querySelectorAll('.device-wrapper');
        const devices = [];
        wrappers.forEach(w => {
            const label = w.querySelector('.device-header span').textContent.split('(')[0].trim();
            devices.push({
                width: parseInt(w.dataset.width),
                height: parseInt(w.dataset.height),
                label: label
            });
        });

        const newWorkspace = { name, devices, id: Date.now() };
        const savedWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
        savedWorkspaces.push(newWorkspace);
        localStorage.setItem('workspaces', JSON.stringify(savedWorkspaces));

        renderWorkspace(newWorkspace);
        
        workspaceForm.reset();
        workspaceModal.classList.add('hidden');
        showToast('Workspace saved!');
    });

    function loadWorkspaces() {
        const savedWorkspaces = JSON.parse(localStorage.getItem('workspaces') || '[]');
        savedWorkspaces.forEach(ws => renderWorkspace(ws));
    }

    function renderWorkspace(ws) {
        const btnWrapper = document.createElement('div');
        btnWrapper.style.display = 'flex';
        btnWrapper.style.gap = '4px';

        const loadBtn = document.createElement('button');
        loadBtn.className = 'device-btn';
        loadBtn.style.flex = '1';
        loadBtn.style.textAlign = 'left';
        loadBtn.textContent = ws.name;
        loadBtn.addEventListener('click', () => {
            devicesGrid.innerHTML = '';
            ws.devices.forEach(d => addDevice(d.width, d.height, d.label));
            if (window.innerWidth <= 768) toggleSidebar();
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'btn outline';
        delBtn.innerHTML = '&times;';
        delBtn.style.padding = '0 8px';
        delBtn.style.color = 'var(--danger)';
        delBtn.title = 'Delete Workspace';
        delBtn.addEventListener('click', () => {
            let saved = JSON.parse(localStorage.getItem('workspaces') || '[]');
            saved = saved.filter(w => w.id !== ws.id);
            localStorage.setItem('workspaces', JSON.stringify(saved));
            btnWrapper.remove();
        });

        btnWrapper.appendChild(loadBtn);
        btnWrapper.appendChild(delBtn);
        workspacesList.appendChild(btnWrapper);
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
