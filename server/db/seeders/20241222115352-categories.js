'use strict';

module.exports = {
  up: (models, mongoose) => {

    return models.categories.insertMany([
      {
        _id: "6747391e0667ff4f30be9dbb",
        category: "Technology",
      },
      {
        _id: "674739360667ff4f30be9dbc",
        category: "Health & Wellness",
      },
      {
        _id: "6747394f0667ff4f30be9dbd",
        category: "Lifestyle",
      },
      {
        _id: "6747396b0667ff4f30be9dbe",
        category: "Business & Finance",
      },
      {
        _id: "6747397f0667ff4f30be9dbf",
        category: "Education",
      },
      {
        _id: "6758508b02b62a1ec2a56802",
        category: "Food & Drink",
      },
      {
        _id: "6758508b02b62a1ec2a56803",
        category: "Entertainment",
      },
      {
        _id: "6758508b02b62a1ec2a56804",
        category: "Environment & Sustainability",
      },
      {
        _id: "6758508b02b62a1ec2a56805",
        category: "Sports",
      },
      {
        _id: "6758508b02b62a1ec2a56806",
        category: "Art & Culture",
      },
      {
        _id: "6758508b02b62a1ec2a56807",
        category: "Parenting & Family",
      },
      {
        _id: "6758508b02b62a1ec2a56808",
        category: "Science",
      },
      {
        _id: "6758508b02b62a1ec2a56809",
        category: "Politics & Current Affairs",
      },
      {
        _id: "6758508b02b62a1ec2a5680a",
        category: "Travel",
      },
      {
        _id: "6758508b02b62a1ec2a5680b",
        category: "DIY & Hobbies",
      },
      {
        _id: "6758508b02b62a1ec2a5680c",
        category: "Personal Blogs",
      }
    ]).then(res => {
      // Prints the number of inserted categories
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
      // Prints the number of deleted categories
      console.log(res.deletedCount);
      });
    */
  }
};
