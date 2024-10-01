import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Add food items
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: 'Food added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Remove food items
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        // Remove image from filesystem
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error(`Failed to remove image: ${err}`);
            }
        });

        // Remove food item from the database
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: 'Food removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export { addFood, listFood, removeFood };
