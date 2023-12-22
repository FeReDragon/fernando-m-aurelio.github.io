
function changeTheme(theme) {
    const themeContainer = document.getElementById('themeContainer');
    themeContainer.classList.remove('bg-light', 'bg-dark', 'text-white');
    switch(theme) {
        case 'dark':
            themeContainer.classList.add('bg-dark', 'text-white');
            break;
        case 'light':
            themeContainer.classList.add('bg-light');
            break;
        case 'auto':
            // Definir lógica para tema automático
            break;
    }
}