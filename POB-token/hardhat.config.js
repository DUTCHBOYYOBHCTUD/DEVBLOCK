require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["0xa9e6c23787c25aefd5ca7c20eca48296f7b37836876b06ef1cd6738f5d66e1a2",
        "0xf8afe32274b0e4cac6da52d9aa45050b2979a00f8749357a8eddfacaf7608cf8",
        "0x78c1f9770853300f272fc7ee4450a2653d5e93d3b6c13dd5a6667c9b6d9169df",
        "0xe961f2924c8389591f87ad2fe8bfb35c802a096fff6f6ae7aa2ec0af16775305",
        "0xbac888dd9ca94e051e14d814c9a8f3d3f4d9c66b52389b163774689c9a33e7c2",
        "0x4a0890e4f583dcd2262e85cf6a1575e1f459f90bf0e6b46659d4858578d6fec4",
        "0x0341b909972d7e846c943947156cee154b0d7c0b6cce580f458ba465a93c6702",
        "0x97cabf6063931e3d1b2450fceca5c97986d1bba0e06b910a4b651ec368e0601c",
        "0x4be3817cd75c706b0a75c04f7e13435286cf616282bc29f96aa57f29a99fbf53",
        "0x831c8a2c1e5ba6a86d97e6efbcc2f9cf2eed36438726091c43a19a535ef80c0f"
      ]
    }
   }
  };

