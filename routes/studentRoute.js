import express from "express";

// Part of NODE JS built-in methods
import path from "path";
import fs from "fs/promises";

// Get the file path
const dataFilePath = path.resolve("data/students.json");

// function to get all the student data
async function getAllStudents() {
  try {
    // read the students.json file using fs
    const students = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(students);
  } catch (error) {
    return error;
  }
}

// Add new student function
async function writeStudents(students) {
  await fs.writeFile(dataFilePath, JSON.stringify(students, null, 2));
}

// Initialize express
const router = express.Router();

// ENDPOINTS
// 1. Get all students
router.get("/", async (req, res) => {
  try {
    const students = await getAllStudents();

    res.status(200).json(students);
  } catch (error) {
    res.status(400).json(error);
  }
});

// 2. Get one student

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const students = await getAllStudents();

  const currentStudent = students.find((student) => student.id === Number(id));

  // if we can't find the student
  if (!currentStudent) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.json(currentStudent);
});

// 3. Add student
router.post("/", async (req, res) => {
  try {
    // 1. Get all the information of the student using req.body
    const { name, email, age, grade, major } = req.body;

    // 2. verify if the information is there
    if (!name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 3. get all students, then get the last student's ID, then increment
    const students = await getAllStudents();
    // If there are students, get the one with the highest ID number then add one, if there are NO students, make newID = 1.
    const newID =
      students.length > 0
        ? Math.max(...students.map((s) => parseInt(s.id))) + 1
        : 1;

    // 4. Build the new student information in one variable
    const newStudent = {
      id: newID,
      name,
      email,
      age: age || null,
      grade: grade || null,
      major: major || null,
      createdAt: new Date().toISOString(), // Current timestamp
      updatedAt: new Date().toISOString(),
    };



    // 5. add the new student to the list of all students using writeStudents function
    students.push(newStudent);
    await writeStudents(students);

    // 6. return all students with the new student added
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error, message: "can not create student" });
  }
});

// 4. Update student

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const students = await getAllStudents();

    const studentIndex = students.findIndex(
      (student) => student.id === Number(id)
    );

    if (studentIndex === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    students[studentIndex] = {
      ...students[studentIndex],
      ...req.body,
      id: Number(id),
      updatedAt: new Date().toISOString(),
    };

    await writeStudents(students);
    res.status(200).json(students[studentIndex]);
  } catch (error) {
    res.status(500).json({ error: "Cannot update student" });
  }
});


// 5. Delete student
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const students = await getAllStudents();

    const studentIndex = students.findIndex(
      (student) => student.id === Number(id)
    );

    if (studentIndex === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];

    await writeStudents(students);

    res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    res.status(500).json({ error: "Cannot delete student" });
  }
});

export default router;
