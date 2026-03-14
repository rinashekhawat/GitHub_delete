document.getElementById('fetchBtn').addEventListener('click', async () => {
    const token = document.getElementById('tokenInput').value;
    const repoListDiv = document.getElementById('repoList');
    
    if (!token) {
        alert("Bhai, pehle token daalo!");
        return;
    }

    repoListDiv.innerHTML = "<p>Loading repos...</p>";

    try {
        // Fetching repos
        const response = await fetch('https://api.github.com/user/repos?per_page=100&affiliation=owner', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) throw new Error("Invalid Token ya API error");

        const repos = await response.json();
        repoListDiv.innerHTML = ""; // Clear loading text

        // Creating UI for each repo
        repos.forEach(repo => {
            const repoDiv = document.createElement('div');
            repoDiv.className = 'repo-item';
            
            repoDiv.innerHTML = `
                <div>
                    <strong>${repo.name}</strong>
                    <span style="font-size: 12px; color: gray;">(${repo.private ? 'Private' : 'Public'})</span>
                </div>
                <button onclick="deleteRepo('${repo.owner.login}', '${repo.name}', this)">Delete</button>
            `;
            repoListDiv.appendChild(repoDiv);
        });

    } catch (error) {
        repoListDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
});

// Delete function (Global scope mein taki HTML se call ho sake)
window.deleteRepo = async function(owner, repoName, buttonElement) {
    const token = document.getElementById('tokenInput').value;
    
    // Galti se delete na ho, isliye confirmation
    const confirmDelete = confirm(`Kya aap sach mein '${repoName}' ko delete karna chahte ho? Ye action undo nahi hoga.`);
    
    if (!confirmDelete) return;

    buttonElement.innerText = "Deleting...";
    buttonElement.disabled = true;

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 204) {
            // UI se repo hata do
            buttonElement.parentElement.remove();
            alert(`${repoName} delete ho gayi.`);
        } else {
            throw new Error("Delete fail ho gaya. Kya token mein delete_repo permission hai?");
        }
    } catch (error) {
        alert(error.message);
        buttonElement.innerText = "Delete";
        buttonElement.disabled = false;
    }
};
