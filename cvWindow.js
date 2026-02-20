(function() {
    //find CV icon (with label)
    const cvIcon = Array.from(document.querySelectorAll('.icon-item'))
        .find(item => item.querySelector('.icon-label')?.textContent.trim().toLowerCase() === 'cv.pdf');
    if (!cvIcon) return;
    const cvLink = cvIcon.querySelector('a');
    if (!cvLink) return;

    //only allow one CV window open at a time
    let cvWindow = null;

    //helper function ti make default button w/ click handler
    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.type = 'button';
        btn.onclick = onClick;
        return btn;
    }

    function setStyles(el, styles) {
        for (const [k, v] of Object.entries(styles)) el.style[k] = v;
    }

    //allow dragging with navbar!!
    function makeDraggable(win, handle) {
        handle.style.cursor = 'move';
        let offsetX, offsetY, dragging = false;
        handle.addEventListener('mousedown', function(e) {
            dragging = true;
            offsetX = e.clientX - win.getBoundingClientRect().left;
            offsetY = e.clientY - win.getBoundingClientRect().top;
            function move(ev) {
                win.style.left = (ev.pageX - offsetX) + 'px';
                win.style.top = (ev.pageY - offsetY) + 'px';
            }
            function up() {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                dragging = false;
            }
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });
        handle.ondragstart = () => false;
    }

    //handle CV icon being clicked
    cvLink.addEventListener('click', function(e) {
        e.preventDefault();
        //if window already open, focus on it (can't have more than one)
        if (cvWindow && document.body.contains(cvWindow)) {
            cvWindow.focus();
            return;
        }
        //create container
        const win = document.createElement('div');
        win.className = 'tab';
        setStyles(win, {
            position: 'absolute',
            left: '30vw',
            top: '15vh',
            width: '40vw',
            height: '60vh',
            zIndex: 25,
            background: '#220135',
            border: 'groove 3px orange',
            borderRadius: '10px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
        });
        win.tabIndex = -1;

        //create navbar
        const nav = document.createElement('div');
        nav.className = 'nav';
        nav.appendChild(createButton('x', () => win.remove())); //close button
        nav.appendChild(createButton('+', () => {
            //maximise button
            setStyles(win, {
                left: '0',
                top: '0',
                width: '100vw',
                height: '100vh',
                zIndex: 30
            });
        }));
        //create content area for pdf
        const tabcontent = document.createElement('div');
        tabcontent.className = 'tabcontent';
        setStyles(tabcontent, {
            height: 'calc(100% - 40px)',
            overflow: 'hidden',
        });
        const iframe = document.createElement('iframe');
        iframe.src = cvLink.href;
        setStyles(iframe, {
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'white',
        });
        tabcontent.appendChild(iframe);
        win.appendChild(nav);
        win.appendChild(tabcontent);
        document.body.appendChild(win);
        win.focus();
        //enable dragging
        makeDraggable(win, nav);
        //track window to avoid duplicates
        cvWindow = win;
    });
})();
