const ethers = require('ethers');

exports.merkleRoot = (items) => {
    if (items.length === 0) throw ('can\'t build merkle tree with empty items');

    let level = items.map(([address, numberOfTokens]) => leafHash(address, numberOfTokens));

    while (level.length > 1) {
        level = hashLevel(level);
    }

    return level[0];
};

exports.merkleProof = (items, item) => {
    let index = items.findIndex(([address, numberOfTokens]) => address === item.address && numberOfTokens === item.numberOfTokens);
    if (index === -1) throw ('item not found in items: ' + item);

    let path = [];
    let witnesses = [];

    let level = items.map(([address, numberOfTokens]) => leafHash(address, numberOfTokens));

    while (level.length > 1) {
        // Get proof for this level

        let nextIndex = Math.floor(index / 2);

        if (nextIndex * 2 === index) { // left side
            if (index < level.length - 1) { // only if we're not the last in a level with odd number of nodes
                path.push(0);
                witnesses.push(level[index + 1]);
            }
        } else { // right side
            path.push(1);
            witnesses.push(level[index - 1]);
        }

        index = nextIndex;
        level = hashLevel(level);
    }

    return {
        path: path.reduceRight((a, b) => (a << 1) | b, 0),
        witnesses,
    };
};

exports.merkleVerification = (root, address, numberOfTokens, path, witnesses) => {
    let item = { address, numberOfTokens };
    let node = leafHash(address, numberOfTokens);
    for (let i = 0; i < witnesses.length; i++) {
        if ((path & '0x01') === 1) {
            node = nodeHash(witnesses[i], node);
        } else {
            node = nodeHash(node, witnesses[i]);
        }
        path /= 2;
    }

    return node === root;
};

// internal utility functions

function hashLevel(level) {
    let nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
        if (i === level.length - 1) nextLevel.push(level[i]); // odd number of nodes at this level
        else nextLevel.push(nodeHash(level[i], level[i + 1]));
    }

    return nextLevel;
}

function leafHash(address, numberOfTokens) {
    return ethers.utils.keccak256(ethers.utils.concat(['0x00', address, numberOfTokens]));
}

function nodeHash(left, right) {
    return ethers.utils.keccak256(ethers.utils.concat(['0x01', left, right]));
}