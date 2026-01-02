document.getElementById("join-btn").addEventListener("click",redirectToJoin)
document.getElementById("create-btn").addEventListener("click",redirectToCreate)


function redirectToJoin() {
    const user = document.getElementById("join-name").value
    const id = document.getElementById("join-code").value
    if (!user || !id) return;
    window.location.replace(`/game?room=${encodeURIComponent(id)}&name=${encodeURIComponent(user)}`);
}



function redirectToCreate() {
    const user = document.getElementById("create-name").value
    if (!user ) return;
    window.location.replace(`/game?name=${encodeURIComponent(user)}`);
}
