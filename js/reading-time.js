// Automatsko računanje vremena čitanja i broja reči
document.addEventListener('DOMContentLoaded', function() {
    const postContent = document.querySelector('.post-content');
    const postTitle = document.querySelector('.post-title, h1');
    
    if (postContent && postTitle) {
        // Računanje broja reči
        const text = postContent.innerText || postContent.textContent || '';
        const wordCount = text.trim().split(/\s+/).length;
        
        // Računanje vremena čitanja (prosečno 200 reči po minuti)
        const readingTimeMinutes = Math.ceil(wordCount / 200);
        
        // Formatiranje broja reči
        const formattedWordCount = wordCount.toLocaleString('sr-RS');
        
        // Kreiranje elementa sa informacijama
        const readingInfo = document.createElement('div');
        readingInfo.className = 'reading-info';
        readingInfo.innerHTML = `<em>~${formattedWordCount} reči • ${readingTimeMinutes} min čitanja</em>`;
        
        // Dodavanje nakon naslova
        postTitle.insertAdjacentElement('afterend', readingInfo);
    }
});
