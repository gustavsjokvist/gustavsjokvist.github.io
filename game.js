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



let upgrades = {
    stoneAxe: {cost: {wood: 10, stone: 10}, purchased: false, requirement: 5},
    stonePickaxe: {cost: {wood: 10, stone: 10}, purchased: false, requirement: 5}
};

function purchaseUpgrade(upgrade) {
    if (!upgrades[upgrade].purchased &&
        resources.wood >= upgrades[upgrade].cost.wood &&
        resources.stone >= upgrades[upgrade].cost.stone) {
        
        resources.wood -= upgrades[upgrade].cost.wood;
        resources.stone -= upgrades[upgrade].cost.stone;
        
        upgrades[upgrade].purchased = true;
        document.getElementById(upgrade).disabled = true;

        if (upgrade === 'stoneAxe') {
            document.querySelector("button[onclick=\"gatherResource('wood')\"]").innerText = "Chop Sapling";
        } else if (upgrade === 'stonePickaxe') {
            document.querySelector("button[onclick=\"gatherResource('stone')\"]").innerText = "Mine Stone";
        }

        updateResourceDisplay();
    }
}

function updateResourceDisplay() {
    document.getElementById('wood').innerText = resources.wood;
    document.getElementById('stone').innerText = resources.stone;

    // Check if upgrades are affordable and enable/disable accordingly
    document.getElementById('stoneAxe').style.display = (resources.wood >= upgrades.stoneAxe.requirement && resources.stone >= upgrades.stoneAxe.requirement) ? "block" : "none";
    document.getElementById('stonePickaxe').style.display = (resources.wood >= upgrades.stonePickaxe.requirement && resources.stone >= upgrades.stonePickaxe.requirement) ? "block" : "none";
    
    document.getElementById('stoneAxe').disabled = (resources.wood < upgrades.stoneAxe.cost.wood || resources.stone < upgrades.stoneAxe.cost.stone || upgrades.stoneAxe.purchased);
    document.getElementById('stonePickaxe').disabled = (resources.wood < upgrades.stonePickaxe.cost.wood || resources.stone < upgrades.stonePickaxe.cost.stone || upgrades.stonePickaxe.purchased);
}

function gatherResource(type) {
    if (!isGathering[type]) {
        isGathering[type] = true;
        let progress = 0;
        const progressBar = document.getElementById(`${type}Progress`);
        
        const gatheringInterval = setInterval(() => {
            progress += 10; 
            progressBar.value = progress;
            
            if (progress >= 100) {
                clearInterval(gatheringInterval); 
                const gatherAmount = (type === 'wood' && upgrades.stoneAxe.purchased) || (type === 'stone' && upgrades.stonePickaxe.purchased) ? 2 : 1;
                resources[type] += gatherAmount; 
                progressBar.value = 0; 
                isGathering[type] = false; 
                
                updateResourceDisplay();
            }
        }, 100); 
    }
}
