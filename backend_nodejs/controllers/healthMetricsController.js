// controllers/healthMetricsController.js
const User = require('../models/user');
const Excel = require('exceljs');

exports.calculateHealthMetrics = async (req, res) => {
  try {
    const { height, weight, activityLevel, gender, age } = req.body;

    // Input validation
    if (!height || !weight || !activityLevel || !gender || !age) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // Calculate Ideal Weight (using Hamwi formula)
    let idealWeight;
    if (gender === 'male') {
      idealWeight = 48 + 2.7 * ((height - 152) / 2.54);
    } else if (gender === 'female') {
      idealWeight = 45.5 + 2.2 * ((height - 152) / 2.54);
    } else {
      idealWeight = (48 + 45.5) / 2 + 2.45 * ((height - 152) / 2.54);
    }

    // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calculate TDEE
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      athlete: 1.9
    };
    const tdee = bmr * activityMultipliers[activityLevel];

    // Update user if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        height,
        weight,
        activityLevel,
        gender,
        age,
        bmi,
        idealWeight,
        metabolicRate: bmr,
        tdee
      });
    }

    res.json({
      bmi: bmi.toFixed(2),
      idealWeight: idealWeight.toFixed(2),
      metabolicRate: bmr.toFixed(2),
      tdee: tdee.toFixed(2)
    });
  } catch (error) {
    console.error('Health metrics calculation error:', error);
    res.status(500).json({ error: 'An error occurred while calculating health metrics' });
  }
};

exports.getUserHealthMetrics = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('height weight age activityLevel bmi metabolicRate tdee idealWeight gender');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      height: user.height,
      weight: user.weight,
      age: user.age,
      activityLevel: user.activityLevel,
      gender: user.gender,
      bmi: user.bmi,
      metabolicRate: user.metabolicRate,
      tdee: user.tdee,
      idealWeight: user.idealWeight
    });
  } catch (error) {
    console.error('Get user health metrics error:', error);
    res.status(500).json({ error: 'An error occurred while retrieving health metrics' });
  }
};

exports.generateExcelReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new workbook and worksheet
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Health Metrics');

    // Add headers
    worksheet.columns = [
      { header: 'Metric', key: 'metric', width: 20 },
      { header: 'Value', key: 'value', width: 40 }
    ];

    // Add user data
    worksheet.addRows([
      { metric: 'First Name', value: user.firstName },
      { metric: 'Last Name', value: user.lastName },
      { metric: 'Height (cm)', value: user.height },
      { metric: 'Weight (kg)', value: user.weight },
      { metric: 'Age', value: user.age },
      { metric: 'Activity Level', value: user.activityLevel },
      { metric: 'Gender', value: user.gender },
      { metric: 'BMI', value: user.bmi },
      { metric: 'Metabolic Rate', value: user.metabolicRate },
      { metric: 'TDEE', value: user.tdee },
      { metric: 'Ideal Weight (kg)', value: user.idealWeight }
    ]);

    // Add empty row for spacing
    worksheet.addRow({});

    // Define health advice based on BMI
    let physicalHealthAdvice, mentalWellnessAdvice, nutritionTips;

    if (user.bmi < 18.5) {
      physicalHealthAdvice = "Your BMI indicates you're underweight. Focus on gaining weight in a healthy way through a balanced diet and strength training exercises.";
      mentalWellnessAdvice = "Being underweight can affect your mood and energy levels. Ensure you're getting proper nutrition and consider talking to a healthcare provider.";
      nutritionTips = "Aim to increase your calorie intake with nutrient-dense foods. Include healthy fats, proteins, and complex carbohydrates in your diet.";
    } else if (user.bmi >= 18.5 && user.bmi < 25) {
      physicalHealthAdvice = "Your BMI indicates you're at a healthy weight. Maintain your current lifestyle with a balanced diet and regular exercise.";
      mentalWellnessAdvice = "Regular exercise and a balanced diet can boost your mood and cognitive function. Consider incorporating stress-reduction activities into your routine.";
      nutritionTips = "Continue with a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats.";
    } else if (user.bmi >= 25 && user.bmi < 30) {
      physicalHealthAdvice = "Your BMI indicates you're overweight. Consider increasing physical activity and making dietary changes to reach a healthier weight.";
      mentalWellnessAdvice = "Regular exercise can improve mood and reduce stress. Focus on finding physical activities you enjoy.";
      nutritionTips = "Focus on portion control and increasing your intake of fruits, vegetables, and whole grains. Limit processed foods and sugary drinks.";
    } else {
      physicalHealthAdvice = "Your BMI indicates obesity. It's important to work with healthcare providers to develop a plan for reaching a healthier weight through diet and exercise.";
      mentalWellnessAdvice = "Your weight may be affecting your mental health. Consider seeking support from a mental health professional along with making lifestyle changes.";
      nutritionTips = "Work with a nutritionist to develop a balanced, calorie-controlled diet. Focus on whole foods and avoid processed, high-calorie options.";
    }

    // Add health insights
    worksheet.addRows([
      { metric: 'Physical Health', value: physicalHealthAdvice },
      { metric: 'Mental Wellness', value: mentalWellnessAdvice },
      { metric: 'Nutrition Tips', value: nutritionTips }
    ]);

    // Calculate calorie needs
    const maintenanceCalories = Math.round(user.tdee);
    const cutCalories = Math.round(maintenanceCalories * 0.85);  // 15% deficit
    const bulkCalories = Math.round(maintenanceCalories * 1.15);  // 15% surplus

    worksheet.addRows([
      { metric: 'Maintenance Calories', value: maintenanceCalories },
      { metric: 'Cut Calories', value: cutCalories },
      { metric: 'Bulk Calories', value: bulkCalories }
    ]);

    // Apply styles
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
        };
      });
      if (rowNumber === 1) {
        row.font = { bold: true };
      }
    });

    // Set up the response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=health_metrics.xlsx');

    // Write to the response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Generate Excel report error:', error);
    res.status(500).json({ error: 'An error occurred while generating the Excel report' });
  }
};