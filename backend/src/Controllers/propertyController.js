// get all properties
// get property based on id


import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";
import slugify from "slugify";
import { isDatabaseUnavailable } from "../utils/db.js";


// get all properties

const getProperties = async(req,res)=>{
    try{
      const validListingQuery = {
        propertyName: {
          $exists: true,
          $nin: ["", null],
          $not: /^powershell test place$/i,
        },
        images: { $elemMatch: { url: { $exists: true, $nin: ["", null] } } },
        $expr: { $gte: [{ $size: "$images" }, 6] },
      };
      const features = new APIFeatures(Property.find(validListingQuery),req.query)
      .filter()
      .search()
      .paginate();

      const doc = await features.query;

      res.status(200).json({
        status:"success",
        no_of_responses: doc.length,
        all_properties: await Property.countDocuments(validListingQuery),
        data:doc
      })
    }catch(error){
        console.error("Error searching properties: ", error)
        res.status(isDatabaseUnavailable(error) ? 503 : 500).json({
          status: "fail",
          message: isDatabaseUnavailable(error)
            ? "The database is unavailable. Check MongoDB Atlas network access and try again."
            : "Internal server Error",
        });
    }
}

//get property by id
// http://localhost:8080/api/v1/rent/listing/:id
//http://localhost:8080/api/v1/rent/listing/666476848
// req.params.id

const getProperty = async(req,res)=>{
    try{
       const property = await Property.findById(req.params.id);

       res.status(200).json({
        status:"success",
        data: property,
       })

    }catch(error){
      res.status(isDatabaseUnavailable(error) ? 503 : 404).json({
        status:"fail",
        message:error.message
      })
    }
}

// CREATE A PROPERTY - an owner adds his house

// take the details, upload every photo to ImageKit,
// keep only the links, then save the house with the owner's
// id attached.
// This route has protect on it, so req.user already exists.
const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body;

    if (!propertyName || !description || !Array.isArray(images) || images.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a property name, description, and at least 6 images",
      });
    }

    const amenityNames = new Map([
      ["wifi", "wifi"],
      ["kitchen", "kitchen"],
      ["ac", "Ac"],
      ["tv", "Tv"],
      ["pool", "Pool"],
      ["free parking", "Free parking"],
      ["washing machine", "washing machine"],
    ]);
    const normalizedAmenities = (Array.isArray(amenities) ? amenities : []).map(
      (amenity) => {
        const name = typeof amenity === "string" ? amenity : amenity?.name;
        const normalizedName = amenityNames.get(name?.trim().toLowerCase());

        if (!normalizedName) {
          const error = new Error(`Invalid amenity: ${name || "unknown"}`);
          error.statusCode = 400;
          throw error;
        }

        return {
          ...(typeof amenity === "object" ? amenity : {}),
          name: normalizedName,
        };
      }
    );

    const normalizedAddress = {
      ...address,
      city: address?.city ? address.city.toLowerCase().replaceAll(" ", "") : "",
    };

    const slug = slugify(propertyName, { lower: true });
    const storedImages = [];

    for (const image of images) {
      if (typeof image?.url !== "string") {
        return res.status(400).json({
          status: "fail",
          message: "Each image must have a valid URL",
        });
      }

      if (image.url.startsWith("data:image/")) {
        const [, mimeType, imageData] =
          image.url.match(/^data:(image\/[^;]+);base64,(.+)$/) || [];

        if (!mimeType || !imageData) {
          return res.status(400).json({
            status: "fail",
            message: "An uploaded image has invalid image data",
          });
        }

        const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
        const result = await imagekit.upload({
          file: imageData,
          fileName: `property_${Date.now()}.${extension}`,
          folder: "property_images",
        });

        storedImages.push({ url: result.url, public_id: result.fileId });
        continue;
      }

      let imageUrl;
      try {
        imageUrl = new URL(image.url);
      } catch {
        return res.status(400).json({
          status: "fail",
          message: "Image links must be valid HTTP or HTTPS URLs",
        });
      }

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        return res.status(400).json({
          status: "fail",
          message: "Image links must be valid HTTP or HTTPS URLs",
        });
      }

      storedImages.push({ url: imageUrl.href, public_id: image.public_id });
    }

    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address: normalizedAddress,
      amenities: normalizedAmenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images: storedImages,
      userId: req.user._id,
      slug,
    });

    res.status(201).json({ status: "success", data: { data: property } });
  } catch (error) {
    console.error("Error creating property", error);
    const statusCode = isDatabaseUnavailable(error)
      ? 503
      : error.name === "ValidationError" || error.statusCode === 400
        ? 400
        : 500;
    res.status(statusCode).json({
      status: "fail",
      message: error.message,
    });
  }
};

// GET MY PROPERTIES - the owner's own dashboard
// find every house whose userId is me.
const getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const property = await Property.find({ userId: userId });
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(isDatabaseUnavailable(error) ? 503 : 404).json({
      status: "fail",
      message: error.message,
    });
  }
};


export{
    getProperties,
    getProperty,
    createProperty,
    getUsersProperties
}