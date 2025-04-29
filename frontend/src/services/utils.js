export const formatDNI = (dni) => {
    try {
        return dni.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3") ;
    } catch (er) {
        return dni;
    }
}