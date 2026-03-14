// KB ko MB ya GB mein convert karne ka function
function formatSize(kb) {
    if (kb === 0) return '0 KB';
    if (kb < 1024) return kb + ' KB';
    const mb = kb / 1024;
    if (mb < 1024) return mb.toFixed(2) + ' MB';
    const gb = mb / 1024;
    return gb.toFixed(2) + ' GB';
}

// DOM load hone ke baad logic chalega
document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const tokenInput = document.getElementById('tokenInput');
    const repoListDiv = document.getElementById('repoList');
    // Agar HTML mein statusMessage id wali div hai toh use karega
    const statusMessage = document.getElementById('statusMessage'); 

    fetchBtn.addEventListener('click', async () => {
        const token = tokenInput.value.trim();
        
        if (!token) {
            alert("Bhai, pehle apna GitHub Classic Token daalo!");
            return;
        }

        if (statusMessage) statusMessage.innerHTML = "Loading repos...";
        else repoListDiv.innerHTML = "<p>Loading repos...</p>";
        
        fetchBtn.disabled = true;
        fetchBtn.innerText = "Fetching...";

        try {
            // Repositories fetch karna (per_page=100 ek baar mein)
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
            
            repoListDiv.innerHTML = ""; // Purani list clear karo
            if (statusMessage) statusMessage.innerHTML = `Total Repos: <strong>${repos.length}</strong>`;

            if(repos.length === 0) {
                repoListDiv.innerHTML = "<p style='text-align: center; color: #555;'>Is token par koi repository nahi mili.</p>";
                return;
            }

            // Har repo ke liye UI generate karna
            repos.forEach(repo => {
                const repoDiv = document.createElement('div');
                repoDiv.className = 'repo-item';
                // Premium look ke liye thodi inline styling di hai agar CSS miss ho jaye
                repoDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 1px solid #eee; margin-bottom: 10px; border-radius: 8px; background: #fff;";
                
                const repoSize = formatSize(repo.size);

                repoDiv.innerHTML = `
                    <div style="flex-grow: 1;">
                        <strong style="display:block; margin-bottom: 8px; font-size: 16px;">${repo.name}</strong>
                        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                            <span style="font-size: 12px; color: ${repo.private ? '#d93025' : '#188038'}; background: ${repo.private ? '#fce8e6' : '#e6f4ea'}; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                                ${repo.private ? 'Private' : 'Public'}
                            </span>
                            <span style="font-size: 12px; color: #5f6368; background: #f1f3f4; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                                💾 ${repoSize}
                            </span>
                        </div>
                    </div>
                    <button class="delete-btn" style="background: #ff4d4d; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-left: 10px; font-weight: bold;" onclick="deleteRepo('${repo.owner.login}', '${repo.name}', this)">Delete</button>
                `;
                repoListDiv.appendChild(repoDiv);
            });

        } catch (error) {
            if (statusMessage) statusMessage.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
            else repoListDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        } finally {
            fetchBtn.disabled = false;
            fetchBtn.innerText = "Fetch Repositories";
        }
    });
});

// Delete function (Global scope mein taki HTML direct call kar sake)
window.deleteRepo = async function(owner, repoName, buttonElement) {
    const token = document.getElementById('tokenInput').value.trim();
    
    // Safety Alert (GitHub jaisi feeling ke liye)
    const confirmDelete = confirm(`WARNING: '${repoName}' hamesha ke liye delete ho jayegi.\nKya aap sach mein ise delete karna chahte ho?`);
    
    if (!confirmDelete) return;

    const originalText = buttonElement.innerText;
    buttonElement.innerText = "Deleting...";
    buttonElement.disabled = true;
    buttonElement.style.background = "#ccc"; // Disabled state color
    buttonElement.style.cursor = "not-allowed";

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 204) {
            // UI se turant repo hata do smoothly
            buttonElement.closest('div[style*="display: flex"]').remove();
            
            // Total repo count update karna
            const statusMessage = document.getElementById('statusMessage');
            if (statusMessage && statusMessage.innerHTML.includes('Total Repos')) {
                const currentCount = document.getElementById('repoList').children.length;
                statusMessage.innerHTML = `Total Repos: <strong>${currentCount}</strong>`;
            }
        } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Delete fail. Token mein 'delete_repo' scope enabled hai?");
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
        buttonElement.innerText = originalText;
        buttonElement.disabled = false;
        buttonElement.style.background = "#ff4d4d"; // Wapas red color set kar do
        buttonElement.style.cursor = "pointer";
    }
};
