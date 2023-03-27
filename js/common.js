const Common = (function () {
    const apiToken = '2525910377721194';
    const apiUrl = `https://www.superheroapi.com/api.php/${apiToken}/`;
    const toastContainer = document.getElementById('toast');
    const FAVOURITES = 'favourites';
    const loader = document.querySelector('.loader');

    function setRandomBackgroundImage() {
        const urls = [
            'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hcnZlbHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60',
            'https://cdn.pixabay.com/photo/2016/03/06/04/14/comics-1239698__480.jpg',
            'https://cdn.pixabay.com/photo/2020/10/12/21/12/cosplay-5650215__480.jpg'
            
        ];

        const randomBackgroundImageUrl =
            urls[Math.floor(Math.random() * urls.length)];

       
        const html = document.querySelector('html');
        html.style.backgroundImage = `url(${randomBackgroundImageUrl})`;
    }

    function showLoader() {
        loader.style.display = 'block';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    /* Notification handler */
    function showNotification(type, message) {
        if (type === 'error') {
            toastContainer.classList.remove('toast-success');
            toastContainer.classList.add('toast-error');
        } else if (type === 'success') {
            toastContainer.classList.remove('toast-error');
            toastContainer.classList.add('toast-success');
        }
        toastContainer.style.display = 'block';
        toastContainer.innerText = message;

        setTimeout(() => {
            toastContainer.style.display = 'none';
        }, 3000);
    }

    /* Send api requests */
    async function apiRequest(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();

            return {
                data,
                success: true,
            };
        } catch (error) {
            console.log('error', error);
            return {
                error: error.message,
                success: false,
            };
        }
    }

    /* Add hero to localstorage */
    function addHeroToFavourites(hero) {
        if (!hero) return;

        const favouritesFromLocalStorage = getFavouriteSuperheroes();
        favouritesFromLocalStorage.push(hero);

        // Save in localstorage
        localStorage.setItem(
            FAVOURITES,
            JSON.stringify(favouritesFromLocalStorage)
        );

        showNotification('success', 'Added to favourites');
    }

    /* Remove hero from localstorage */
    function removeHeroFromFavourites(heroId) {
        if (!heroId) return;

        let favouritesFromLocalStorage = getFavouriteSuperheroes();

        // Remove hero from localstorage
        favouritesFromLocalStorage = favouritesFromLocalStorage.filter(
            (item) => item.id !== heroId
        );

        // Save in localstorage
        localStorage.setItem(
            FAVOURITES,
            JSON.stringify(favouritesFromLocalStorage)
        );

        showNotification('success', 'Removed from favourites');
    }

    /* Get fav superheroes from the local storage */
    function getFavouriteSuperheroes() {
        return localStorage.getItem(FAVOURITES) ?
            JSON.parse(localStorage.getItem(FAVOURITES)) :
            [];
    }

    function debounce(func, delay) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;

            clearTimeout(timeout);

            timeout = setTimeout(function () {
                timeout = null;
                func.apply(context, args);
                // handleSearch(args);
            }, delay);
        };
    }

    setRandomBackgroundImage();

    return {
        apiRequest,
        apiUrl,
        showNotification,
        addHeroToFavourites,
        removeHeroFromFavourites,
        getFavouriteSuperheroes,
        showLoader,
        hideLoader,
        debounce
    };
})();