export const formatPhoneNumber = (number: string) => {
    return number.replace(/\s+/g, "");
}

export const saveScrollPosition = () => {
    sessionStorage.setItem("projectScrollPos", window.scrollY.toString());
};