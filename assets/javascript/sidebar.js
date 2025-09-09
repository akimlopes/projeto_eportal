 document.addEventListener('DOMContentLoaded', () => {
            const body = document.body;
            const btnCollapse = document.getElementById('btnCollapse');
            const btnOpen = document.getElementById('btnOpen');
            const overlay = document.getElementById('overlay');

            /* --------- Colapsar/Expandir (desktop) --------- */
            function toggleCollapse() {
                const collapsed = body.classList.toggle('sidebar-collapsed');
                btnCollapse.setAttribute('aria-expanded', String(!collapsed));
                hideAllSubmenus();
            }
            btnCollapse.addEventListener('click', toggleCollapse);

            /* --------- Abrir/Fechar (mobile) --------- */
            function openSidebar() {
                body.classList.add('sidebar-open');
                btnOpen.setAttribute('aria-expanded', 'true');
            }
            function closeSidebar() {
                body.classList.remove('sidebar-open');
                btnOpen.setAttribute('aria-expanded', 'false');
            }
            btnOpen.addEventListener('click', openSidebar);
            overlay.addEventListener('click', closeSidebar);
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSidebar(); } });

            /* ---------- SUBMENU FLYOUT (desktop) ---------- */
            const navItems = document.querySelectorAll('.nav-item.has-sub');
            const hideTimers = new WeakMap();

            function showFixedSubmenu(navItem) {
                if (window.innerWidth <= 768) return;
                const link = navItem.querySelector('.nav-link');
                const submenu = navItem.querySelector('.submenu');
                if (!submenu) return;

                clearTimeout(hideTimers.get(submenu));
                submenu.classList.add('show');
                submenu.style.display = 'block';
                const measured = submenu.getBoundingClientRect();
                const linkRect = link.getBoundingClientRect();

                let top = Math.max(8, linkRect.top);
                let left = linkRect.right + 10;

                if (top + measured.height > window.innerHeight - 8) {
                    top = Math.max(8, window.innerHeight - measured.height - 8);
                }

                if (left + measured.width > window.innerWidth - 8) {
                    left = linkRect.left - measured.width - 10;
                    if (left < 8) left = 8;
                }

                submenu.style.top = top + 'px';
                submenu.style.left = left + 'px';
                submenu.style.maxHeight = (window.innerHeight - 20) + 'px';
            }

            function hideFixedSubmenuDelayed(submenu, delay = 160) {
                clearTimeout(hideTimers.get(submenu));
                const t = setTimeout(() => {
                    submenu.classList.remove('show');
                    submenu.style.display = '';
                    submenu.style.top = '';
                    submenu.style.left = '';
                }, delay);
                hideTimers.set(submenu, t);
            }

            function hideAllSubmenus() {
                document.querySelectorAll('.submenu.show').forEach(s => {
                    s.classList.remove('show');
                    s.style.display = '';
                    s.style.top = '';
                    s.style.left = '';
                });
            }

            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                const submenu = item.querySelector('.submenu');

                item.addEventListener('mouseenter', () => showFixedSubmenu(item));
                item.addEventListener('mouseleave', () => { if (submenu) hideFixedSubmenuDelayed(submenu, 180); });

                if (submenu) {
                    submenu.addEventListener('mouseenter', () => {
                        clearTimeout(hideTimers.get(submenu));
                        submenu.classList.add('show');
                    });
                    submenu.addEventListener('mouseleave', () => hideFixedSubmenuDelayed(submenu, 150));
                }

                item.addEventListener('focusin', () => showFixedSubmenu(item));
                item.addEventListener('focusout', () => { if (submenu) hideFixedSubmenuDelayed(submenu, 150); });

                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        item.classList.toggle('open'); // accordion on mobile
                    }
                });
            });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                hideAllSubmenus();
                resizeTimer = setTimeout(() => { }, 120);
            });

            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) return;
                const inside = e.target.closest('.nav-item.has-sub, .submenu');
                if (!inside) hideAllSubmenus();
            });

            window.addEventListener('scroll', () => {
                document.querySelectorAll('.submenu.show').forEach(s => {
                    const parent = Array.from(navItems).find(it => it.querySelector('.submenu') === s);
                    if (parent) showFixedSubmenu(parent);
                });
            }, { passive: true });

        });