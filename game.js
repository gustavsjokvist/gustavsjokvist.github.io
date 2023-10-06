let resources = {
    wood: 20,
    stone: 20,
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
    if (actions[action]) return;  // Prevent action if it's already in progress

    actions[action] = true;  // Mark action as in-progress
    let actionDuration = 1000;  // Action takes 1000ms to perform

    let progressBar = document.getElementById(`${action}Progress`);
    progressBar.value = 0;

    let progressInterval = setInterval(() => {
        progressBar.value += 10;  // Incrementally increase progress bar
    }, actionDuration / 10);  // Divide actionDuration by 10 for smooth progress
    

    setTimeout(() => {
        clearInterval(progressInterval);  // Clear the interval when action is complete
        progressBar.value = 0;  // Reset progress bar
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
    document.getElementById('woodCount').innerText = `Wood: ${resources.wood}`;
    document.getElementById('stoneCount').innerText = `Stone: ${resources.stone}`;
    document.getElementById('charcoalCount').innerText = `Charcoal: ${resources.charcoal}`;
    document.getElementById('ironOreCount').innerText = `Iron Ore: ${resources.ironOre}`;
    document.getElementById('ironBarCount').innerText = `Iron Bar: ${resources.ironBar}`;

    // Upgrade buttons: Display and enable/disable based on conditions
    for (const upgradeKey in upgrades) {
        const upgrade = upgrades[upgradeKey];
        document.getElementById(`${upgradeKey}Btn`).style.display = canAfford(upgrade.cost) && !upgrade.purchased ? 'block' : 'none';
    }

    // Item buttons: Display and enable/disable based on conditions
    document.getElementById('buildHammer').style.display = canAfford(resourceCosts.hammer) && !items.hammer ? 'block' : 'none';
    document.getElementById('hammerInfo').style.display = !items.hammer ? 'block' : 'none';

    document.getElementById('buildAnvil').style.display = canAfford(resourceCosts.anvil) && items.hammer && !items.anvil ? 'block' : 'none';
    document.getElementById('anvilInfo').style.display = items.hammer && !items.anvil ? 'block' : 'none';
}

function canAfford(cost) {
    for (const resource in cost) {
        if (resources[resource] < cost[resource]) {
            return false;
        }
    }
    return true;
}

// Event listeners
document.getElementById('gatherStickBtn').addEventListener('click', () => performAction('gatherStick'));
document.getElementById('gatherRockBtn').addEventListener('click', () => performAction('gatherRock'));

document.getElementById('stoneAxeBtn').addEventListener('click', () => purchaseUpgrade('stoneAxe'));
document.getElementById('stonePickaxeBtn').addEventListener('click', () => purchaseUpgrade('stonePickaxe'));
document.getElementById('mineIronOreBtn').addEventListener('click', () => performAction('mineIronOre'));


document.getElementById('buildHammer').addEventListener('click', () => buildItem('hammer'));
document.getElementById('buildAnvil').addEventListener('click', () => buildItem('anvil'));

// Initialize
updateResourceDisplay();
