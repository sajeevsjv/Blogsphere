'use strict';

module.exports = {
  up: (models, mongoose) => {

    return models.categories.insertMany([
      {
        _id: "6747391e0667ff4f30be9dbb",
        category: "Clothing",
        sub_categories: ["T-Shirts & Polos",
          "Shirts",
          "Trousers",
          "Jeans",
          "Innerwear",
          "Sportswear",
          "Sleep & Lounge Wear",
          "Ethnic Wear",
          "Ties, Socks & Belts",
          "Suits & Blazers",
          "Sweaters",
          "Jackets & Coats",
        ]
      },
      {
        _id: "674739360667ff4f30be9dbc",
        category: "Shoes",
        sub_categories: ["Sports Shoes",
          "Formal Shoes",
          "Casual Shoes",
          "Sneakers",
          "Loafers & Moccasins",
          "Flip-Flops",
          "Boots",
          "Sandals & Floaters",
          "Thong Sandals",
          "Boat Shoes",
        ]
      },
      {
        _id: "6747394f0667ff4f30be9dbd",
        category: "Watches",
        sub_categories : ["Metallic", "Chronographs", "Leather"]
      },
      {
        _id: "6747396b0667ff4f30be9dbe",
        category: "Jewellery",
        sub_categories : ["Rings", "Bracelets"]
      },
      {
        _id: "6747397f0667ff4f30be9dbf",
        category: "Eyewear",
        sub_categories : ["Sunglasses", "Spectacle Frames"]
      },
      {
        _id: "6758508b02b62a1ec2a56802",
        category: "Wallets"
      }

    ]

    ).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
  }
};
