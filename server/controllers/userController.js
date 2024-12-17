const users = require('../db/models/users');
const user_types = require("../db/models/user_types");
const { success_function, error_function } = require('../utils/response-handler');
const bcrypt = require('bcrypt');
const sendEmail = require("../utils/send-email").sendEmail;
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

exports.signup = async function (req, res) {
  try {

    let body = req.body;
    console.log("body : ", body);

    let name = req.body.name;
    console.log("name : ", name);

    let emails = req.body.email;
    console.log("email : ", emails);

    password = body.password;

    let count = await users.countDocuments({ email: emails });
    console.log("count : ", count);

    let user_type_fromSignup = body.user_type;
    console.log("user_type from input :",user_type_fromSignup);
    let usertype = await  user_types.findOne({user_type : user_type_fromSignup});
    if(usertype){
      body.user_type = usertype._id;
    }
    
    if (count > 0) {
      let response = error_function({
        statusCode: 400,
        message: "user already exists"
      })
      res.status(response.statusCode).send(response);
      return;
    }

    //validations required
    if (!name) {
      let response = error_function({
        statusCode: 400,
        message: 'Name is required'
      });
      res.status(response.statusCode).send(response);
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);

    body.password = hashed_password;

    // function generateOTP() {
    //   // Generate a random number between 100000 and 999999 (inclusive)
    //   let otp = Math.floor(100000 + Math.random() * 900000);
    //   return otp.toString();  // Convert to string if you need it as a string
    // }
    // let otp = generateOTP();

    // body.otp = otp;
    // console.log("body :",body);

    let user = await users.create(body);
    if (user) {
      let response = success_function({
        statusCode: 200,
        message: 'Signup succesfull! Login to continue.'
      });
      res.status(response.statusCode).send(response);
      return;
      // let content = await otpVerification(name,emails,otp);
      // await sendEmail(emails,"Otp Verification",content);

      // if(sendEmail){
      //   let response = success_function({
      //     statusCode : 200,
      //     message : 'OTP has been sent to your email. Please verify.'
      // });
      // res.status(response.statusCode).send(response);
      // return;
      // }
      // else{
      //   let response = error_function({
      //     statusCode : 400,
      //     message : 'Failed to send otp'
      // });
      // res.status(response.statusCode).send(response);
      // return;
      // }

    }
    else {
      let response = error_function({
        statusCode: 400,
        message: 'user creation failed.'
      });
      res.status(response.statusCode).send(response);
      return;
    }

  } catch (error) {
    console.log("error : ", error);
    res.status(400).send(error.message ? error.message : "Something went wrong");
    return;
  }
}

// exports.resendOtp = async function (req, res) {
//   let body = req.body;
//   let emails = body.email;

//   // Function to generate a 6-digit OTP
//   function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }

//   let newotp = generateOTP();

//   try {
//     // Check if the user exists
//     let user = await users.findOne({ email: emails });

//     if (!user) {
//       let response = error_function({
//         statusCode: 404,
//         message: "User not found with the provided email."
//       });
//       return res.status(response.statusCode).send(response);
//     }

//     let name = user.name;

//     // Generate email content for OTP
//     let content = await otpVerification(name, emails, newotp);

//     // Send email with OTP
//     let emailSent = await sendEmail(emails, "OTP Verification", content);

//     if (emailSent) {
//       // Update the user's OTP in the database
//       let updateResult = await users.updateOne(
//         { _id: user._id },
//         { $set: { otp: newotp } }
//       );

//       if (updateResult.modifiedCount > 0) {
//         let response = success_function({
//           statusCode: 200,
//           message: "OTP has been sent to your email. Please verify."
//         });
//         return res.status(response.statusCode).send(response);
//       } else {
//         throw new Error("Failed to update OTP in the database.");
//       }
//     } else {
//       let response = error_function({
//         statusCode: 500,
//         message: "Failed to send OTP. Please try again later."
//       });
//       return res.status(response.statusCode).send(response);
//     }
//   } catch (error) {
//     console.error("Error in resendOtp:", error.message || error);
//     let response = error_function({
//       statusCode: 500,
//       message: "An unexpected error occurred. Please try again later."
//     });
//     return res.status(response.statusCode).send(response);
//   }
// };



// exports.otpVerification = async function (req, res) {
//   try {
//     // verifying otp
//     let otp = req.body.otp;
//     if (otp) {
//       let user = await users.findOne({ otp });
//       if (user) {
//         let response = success_function({
//           statusCode: 200,
//           message: 'Signup successful! You can now log in and start using your account.'
//         });
//         res.status(response.statusCode).send(response);
//         user.otp = null;
//         let updateuser = await users.updateOne({ _id: user._id }, { $set: { otp: null } })
//         return;
//       }
//       else {
//         let response = error_function({
//           statusCode: 400,
//           message: 'invalid otp'

//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }
//     }

//   }
//   catch (error) {
//     console.log(error.message ? error.message : error);
//     let response = error_function({
//       statusCode: 200,
//       message: error.message ? error.message : error
//     });
//     res.status(response.statusCode).send(response);
//     return;
//   }
// }

exports.getAllUsers = async(req, res) => {
  try{
    let allUsers = await users.find();

    if(allUsers){
      let response = success_function({
        statusCode: 200,
        data : allUsers
      })
      res.status(response.statusCode).send(response);
    }
  }
  catch(error){
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    })
    res.status(response.statusCode).send(response);
  }
}

exports.getSingleUser = async (req,res) =>{
  try{
    let _id = req.params.id;
    let user = await users.findOne({_id}).populate("cart.product")
    if(user){
      let response = success_function({
        statusCode : 200,
        data : user
      })
      res.status(response.statusCode).send(response);
      return;
    }
  }
  catch(error){
    console.log("error :",error);
    let response = success_function({
      statusCode : 400,
      message : error.message ? error.message : error
    })
    res.status(response.statusCode).send(response);
    return;
  }
  }

exports.setShippingAdress = async (req,res) => {
  let addressData = req.body
  console.log("addressData :", addressData);
  const user_id = new mongoose.Types.ObjectId(req.params.id);
  
  let updateuser = await users.updateOne(
    { _id: user_id }, 
    { $push: { address: addressData } } // Use $push to append to the array
  );
  if(updateuser){
    let response = success_function({
      statusCode : 200,
      message : "adress added sucessfully"
    })
    return res.status(response.statusCode).send(response);
  }
  else{
      let response = error_function({
        statusCode : 400,
        message : "adress added sucessfully"
      })
      return res.status(response.statusCode).send(response);
  }
}
