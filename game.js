let resources = {
    wood: 0,
    stone: 0
};

let isGathering = {
    wood: false,
    stone: false
};

function gatherResource(type) {
    if (!isGathering[type]) {
        isGathering[type] = true;
        let progress = 0;
        const progressBar = document.getElementById(`${type}Progress`);
        
        const gatheringInterval = setInterval(() => {
            progress += 10; // Filling the progress bar by 10% each 100ms
            progressBar.value = progress;
            
            if (progress >= 100) {
                clearInterval(gatheringInterval); // Stop interval
                resources[type]++; // Add resource
                document.getElementById(type).innerText = resources[type]; // Update display
                progressBar.value = 0; // Reset progress bar
                isGathering[type] = false; // Enable gathering again
            }
        }, 100); // Repeat every 100ms
    }
}
