// KB ko MB ya GB mein convert karne ka function
function formatSize(kb) {
    if (kb === 0) return '0 KB';
    if (kb < 1024) return kb + ' KB';
    const mb = kb / 1024;
    if (mb < 1024) return mb.toFixed(2) + ' MB';
    const gb = mb / 1024;
    return gb.toFixed(2) + ' GB';
}

// DOM load hone ke baad saara logic yahan chalega
document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const tokenInput = document.getElementById('tokenInput');
    const repoListDiv = document.getElementById('repoList');
    const statusMessage = document.getElementById('statusMessage');

    fetchBtn.addEventListener('click', async () => {
        const token = tokenInput.value.trim();
        
        if (!token) {
            statusMessage.innerHTML = "<span style='color: #dc3545;'>Bhai, pehle apna GitHub Classic Token daalo!</span>";
            return;
        }

        statusMessage.innerHTML = "Loading repos...";
        fetchBtn.disabled = true;
        fetchBtn.innerText = "Fetching...";
        repoListDiv.innerHTML = ""; // Purani list clear karo

        try {
            const response = await fetch('https://api.github.com/user/repos?per_page=100&affiliation=owner', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                if(response.status === 401) throw new Error("Invalid Token! Kripya sahi token check karein.");
                throw new Error("GitHub API Error: " + response.status);
            }

            const repos = await response.json();
            
            if(repos.length === 0) {
                statusMessage.innerHTML = "Is token par koi repository nahi mili.";
                fetchBtn.disabled = false;
                fetchBtn.innerText = "Fetch Repositories";
                return;
            }

            statusMessage.innerHTML = `Total Repositories: <strong>${repos.length}</strong>`;

            repos.forEach(repo => {
                const repoDiv = document.createElement('div');
                repoDiv.className = 'repo-item';
                
                const badgeId = `badge-${repo.name}`;
                const isPrivateClass = repo.private ? 'badge-private' : 'badge-public';
                const isPrivateText = repo.private ? 'Private' : 'Public';

                // Premium UI ke classes jo HTML mein the
                repoDiv.innerHTML = `
                    <div class="repo-header">
                        <div>
                            <div class="repo-title">${repo.name}</div>
                            <div class="badges">
                                <span id="${badgeId}" class="badge ${isPrivateClass}">
                                    ${isPrivateText}
                                </span>
                                <span class="badge badge-size">
                                    💾 ${formatSize(repo.size)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="btn-toggle" onclick="toggleVisibility('${repo.owner.login}', '${repo.name}', ${repo.private}, this, '${badgeId}')">
                            Toggle Vis
                        </button>
                        <button class="btn-delete" onclick="deleteRepo('${repo.owner.login}', '${repo.name}', this)">
                            Delete
                        </button>
                    </div>
                `;
                repoListDiv.appendChild(repoDiv);
            });

        } catch (error) {
            statusMessage.innerHTML = `<span style="color: #dc3545;">Error: ${error.message}</span>`;
        } finally {
            fetchBtn.disabled = false;
            fetchBtn.innerText = "Fetch Repositories";
        }
    });
});

// Visibility Toggle logic (Global function)
window.toggleVisibility = async function(owner, repoName, isCurrentlyPrivate, buttonElement, badgeId) {
    const token = document.getElementById('tokenInput').value.trim();
    const newVisibility = !isCurrentlyPrivate; 
    
    const confirmToggle = confirm(`Kya aap '${repoName}' ko ${newVisibility ? 'PRIVATE' : 'PUBLIC'} karna chahte ho?`);
    if (!confirmToggle) return;

    const originalText = buttonElement.innerText;
    buttonElement.innerText = "...";
    buttonElement.disabled = true;

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ private: newVisibility })
        });

        if (response.ok) {
            const badgeElement = document.getElementById(badgeId);
            if (newVisibility) {
                badgeElement.innerText = "Private";
                badgeElement.className = "badge badge-private"; // CSS class update
            } else {
                badgeElement.innerText = "Public";
                badgeElement.className = "badge badge-public"; // CSS class update
            }
            
            // Onclick update karo taaki agle click par nayi state bheje
            buttonElement.setAttribute('onclick', `toggleVisibility('${owner}', '${repoName}', ${newVisibility}, this, '${badgeId}')`);
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Update fail. Token mein 'repo' scope enabled hai?");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        buttonElement.innerText = originalText;
        buttonElement.disabled = false;
    }
};

// Repo Delete logic (Global function)
window.deleteRepo = async function(owner, repoName, buttonElement) {
    const token = document.getElementById('tokenInput').value.trim();
    
    const confirmDelete = confirm(`WARNING: '${repoName}' hamesha ke liye delete ho jayegi.\nKya aap sach mein ise delete karna chahte ho?`);
    if (!confirmDelete) return;

    const originalText = buttonElement.innerText;
    buttonElement.innerText = "...";
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
            buttonElement.closest('.repo-item').remove();
            
            // Total repo count ko live update karna
            const statusMessage = document.getElementById('statusMessage');
            if (statusMessage && statusMessage.innerHTML.includes('Total Repositories')) {
                const currentCount = document.getElementById('repoList').children.length;
                statusMessage.innerHTML = `Total Repositories: <strong>${currentCount}</strong>`;
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Delete fail. Token mein 'delete_repo' scope enabled hai?");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
        buttonElement.innerText = originalText;
        buttonElement.disabled = false;
    }
};
