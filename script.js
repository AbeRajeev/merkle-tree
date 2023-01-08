const { merkleRoot, merkleProof, merkleVerification } = require('./merkleTreeV2.js');

const data = [['0x5a6e95f8b98f6d52781a1a4068b14ce4fa7d0fa4', 34], ['0x9a8eab7c1d2e12b57cd91b8cb2ebeed1d2e1f7c9', 546], ['0x7ddb8509c6620e0ecca8f1d76d3958f3c3d9b2f3', 765], ['0x4484f04a3be7befb96d3f7a9b9c89b7a998327a7', 7564], ['0x876e7f4e4f4c7d9a9aa947e6f2d6e29b1737b832', 2343], ['0x1e13532cfd9a9a9f1c38f9f05a11c42e6817b66a', 2524], ['0xd0d238470e9e3f3d44afd79dddc094536f816f50', 432], ['0x0c1b2812cd3e3c44d75cf6479e85b23c8a7a36a2', 234], ['0xc19da906e9c1d9934d58dc7fd4ad8e0f0120d4a4', 43543], ['0x8ca74c0aa2aac1e7c7a2a59f3c3b17d36b72a7b9', 5434]]

//const tree = new merkleTree(data);
const root = merkleRoot(data);
console.log(root);

const item = { address: '0x7ddb8509c6620e0ecca8f1d76d3958f3c3d9b2f3', numberOfTokens: 765 };
const proof = merkleProof(data, item);
console.log(proof);

const verification = merkleVerification(root, item.address, item.numberOfTokens, proof.path, proof.witnesses);
console.log(verification);

const item2 = { address: '0x1234567890abcdef01234567890abcdef0123456', numberOfTokens: 0 };

// Generate proof for the non-existent data point
const proof2 = merkleProof(data, item);

// Verify the proof
const verified = merkleVerification(root, item2.address, item2.numberOfTokens, proof2.path, proof.witnesses);
console.log(verified); // Output: false