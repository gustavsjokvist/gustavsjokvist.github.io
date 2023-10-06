let resources = {
    wood: 0,
    stone: 0,
    charcoal: 0,
    ironOre: 0,
    ironBar: 0
};

let upgrades = {
    stoneAxe: {
        cost: { wood: 10, stone: 10 },
        purchased: false,
        actionChange: { prev: "gatherStick", next: "chopSapling", newValue: 2 },
        resourceChange: { resource: "wood", newIncrement: 2 }
    },
    stonePickaxe: {
        cost: { wood: 10, stone: 10 },
        purchased: false,
        actionChange: { prev: "gatherRock", next: "mineStone", newValue: 2 },
        resourceChange: { resource: "stone", newIncrement: 2 },
        unlocks: ['ironOre']
    },
    furnace: {
        cost: { stone: 10 },
        purchased: false
    }
};

let items = {
    hammer: false,
    anvil: false
};

let resourceCosts = {
    hammer: { ironBar: 3, wood: 20 },
    anvil: { ironBar: 10 }
};

let actions = {
    gatherStick: false,
    gatherRock: false,
    chopSapling: false,
    mineStone: false
};

function performAction(action) {
    // Additional safeguard to validate that action exists
    if (!actions.hasOwnProperty(action) || actions[action]) return;

    actions[action] = true;
    let actionDuration = 1000;

    let progressBar = document.getElementById(`${action}Progress`);
    progressBar.value = 0;
    
    let progressInterval = setInterval(() => {
        progressBar.value += 10;  // Incrementally increase progress bar
    }, actionDuration / 10);  // Divide actionDuration by 10 for smooth progress
    

    setTimeout(() => {
        clearInterval(progressInterval);
        progressBar.value = 0;
        progressBar.style.display = 'none'; // Hide progress bar when action is complete

        switch (action) {
            case "gatherStick":
                resources.wood += 1;
                break;
            case "gatherRock":
                resources.stone += 1;
                break;
            case "chopSapling":
                resources.wood += upgrades.stoneAxe.resourceChange.newIncrement;
                break;
            case "mineStone":
                resources.stone += upgrades.stonePickaxe.resourceChange.newIncrement;
                break;
            case "mineIronOre":
                resources.ironOre += 1;
                break;
            // ... Other actions as they get defined ...
        }
        actions[action] = false;  // Mark action as complete
        updateResourceDisplay();
    }, actionDuration);
}

function purchaseUpgrade(upgradeKey) {
    let upgrade = upgrades[upgradeKey];

    if (upgrade.purchased || !canAfford(upgrade.cost)) {
        return;
    }

    // Deduct the cost of the upgrade from the player's resources
    for (const resource in upgrade.cost) {
        resources[resource] -= upgrade.cost[resource];
    }
    
    upgrade.purchased = true;

    // Logic for changing actions if applicable
    if (upgrade.actionChange) {
        document.getElementById(`${upgrade.actionChange.prev}Btn`).style.display = 'none';
        document.getElementById(`${upgrade.actionChange.next}Btn`).style.display = 'block';
    }

    // Logic for unlocking resources
    if (upgrade.unlocks) {
        upgrade.unlocks.forEach(resource => {
            document.getElementById(`${resource}Count`).style.display = 'block';
            if (resource === "ironOre") {
                document.getElementById('mineIronOreBtn').style.display = 'block';
            }
        });
    }
    
    // Update the display after resources have been deducted
    updateResourceDisplay();
}



function buildItem(item) {
    let canBuild = true;

    for (const resource in resourceCosts[item]) {
        if (resources[resource] < resourceCosts[item][resource]) {
            canBuild = false;
            break;
        }
    }

    if (canBuild) {
        items[item] = true;
        for (const resource in resourceCosts[item]) {
            resources[resource] -= resourceCosts[item][resource];
        }
        updateResourceDisplay();
    }
}

function smeltIron() {
    if (resources.ironOre >= 2 && resources.charcoal >= 2) {
        resources.ironOre -= 2;
        resources.charcoal -= 2;
        resources.ironBar += 1;
        updateResourceDisplay();
    }
}

function updateResourceDisplay() {
    // Resource elements
    let resourceElements = {
        woodCount: `Wood: ${resources.wood}`,
        stoneCount: `Stone: ${resources.stone}`,
        charcoalCount: `Charcoal: ${resources.charcoal}`,
        ironOreCount: `Iron Ore: ${resources.ironOre}`,
        ironBarCount: `Iron Bar: ${resources.ironBar}`
    };

    // Updating resource counts
    for (let [elemId, text] of Object.entries(resourceElements)) {
        let element = document.getElementById(elemId);
        if (!element) {
            console.error(`Element ${elemId} not found!`);
            continue;
        }
        element.innerText = text;
    }

    // Upgrade buttons: Display and enable/disable based on conditions
    for (const upgradeKey in upgrades) {
        const upgrade = upgrades[upgradeKey];
        let btnElement = document.getElementById(`${upgradeKey}Btn`);
        if (!btnElement) {
            console.error(`Upgrade button element ${upgradeKey}Btn not found!`);
            continue;
        }
        btnElement.style.display = canAfford(upgrade.cost) && !upgrade.purchased ? 'block' : 'none';
    }

    // Item buttons: Display and enable/disable based on conditions
    let hammerBtn = document.getElementById('buildHammer');
    let hammerInfo = document.getElementById('hammerInfo');
    let anvilBtn = document.getElementById('buildAnvil');
    let anvilInfo = document.getElementById('anvilInfo');

    if (!hammerBtn || !hammerInfo || !anvilBtn || !anvilInfo) {
        console.error("Some item elements are not found!");
    } else {
        hammerBtn.style.display = canAfford(resourceCosts.hammer) && !items.hammer ? 'block' : 'none';
        hammerInfo.style.display = !items.hammer ? 'block' : 'none';

        anvilBtn.style.display = canAfford(resourceCosts.anvil) && items.hammer && !items.anvil ? 'block' : 'none';
        anvilInfo.style.display = items.hammer && !items.anvil ? 'block' : 'none';
    }
}


function canAfford(cost) {
    for (const resource in cost) {
        if (resources[resource] < cost[resource]) {
            return false;
        }
    }
    return true;
}

// Ensure event listeners are attached only after DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('gatherStickBtn').addEventListener('click', () => performAction('gatherStick'));
    document.getElementById('gatherRockBtn').addEventListener('click', () => performAction('gatherRock'));

    document.getElementById('stoneAxeBtn').addEventListener('click', () => purchaseUpgrade('stoneAxe'));
    document.getElementById('stonePickaxeBtn').addEventListener('click', () => purchaseUpgrade('stonePickaxe'));
    
    // Initialize
    updateResourceDisplay();
});
