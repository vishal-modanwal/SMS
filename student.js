


const students = [];
const rollNum = new Set();
let totalstudent = document.querySelector("#showTotal");
class Student {
    constructor(name, roll, marks, course, status) {
        this.name = name;
        this.roll = roll;
        this.marks = marks;
        this.course = course;
        this.status = status;
        this.status = marks >= 40 && marks <= 100 ? "Pass" : "Fail";
    }

    addStudent() {
        students.push(this);
    }
}

function loadStudentsFromStorage() {
    const stored = localStorage.getItem("students");

    students.length = 0;
    rollNum.clear();

    if (stored) {
        const data = JSON.parse(stored);
        data.forEach(student => {
            const newStudent = new Student(
                student.name,
                parseInt(student.roll),
                parseInt(student.marks),
                student.course
            );
            students.push(newStudent);
            rollNum.add(newStudent.roll);
        });
    }

    displayStudents();
    showTotalStudents();
}

function showTotalStudents() {
   totalstudent.textContent = `total student is ${students.length}`;
}




document.addEventListener("DOMContentLoaded", () => {

    loadStudentsFromStorage();
    showTotalStudents();
    // Add Student Form
    const studentForm = document.getElementById("studentForm");
    if(studentForm){
        studentForm.addEventListener("submit", function(event){
            event.preventDefault();
            const name = document.getElementById("name").value;
            const roll = parseInt(document.getElementById("roll").value);
            const marks = parseInt(document.getElementById("marks").value);
            const course = document.getElementById("course").value;

            if (!name || !roll || !marks || !course) {
                alert("Please fill all the fields");
                return;
            }
            if(rollNum.has(roll)) return alert("Roll number must be unique");
            if (isNaN(roll) || roll <= 0) {
                alert("Roll number must be a number and greater than 0");
                return;
            }
            if (isNaN(marks) || marks < 0 || marks > 100) {
                alert("Marks must be a number between 0 and 100");
                return;
            }

            const newStudent = new Student(name, roll, marks, course);
            newStudent.addStudent();
            rollNum.add(roll);
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            studentForm.reset();
            showTotalStudents();
        });
    }
    const showTotalBtn = document.getElementById("showTotal");
    if(showTotalBtn){
        showTotalBtn.addEventListener("click", function() {
            const total = showTotalStudents();
            this.innerText = `Total Students is ${total}`;
        });
    }
    const deleteBtn = document.getElementById("deleteBtn");
    if(deleteBtn){
        deleteBtn.addEventListener("click", function() {
            const rollInput = document.getElementById("deleteRoll");
            if(!rollInput) return;

            const roll = parseInt(rollInput.value);
            if (isNaN(roll)) {
                alert("Please enter a valid roll number");
                return;
            }
            deleteStudent(roll);
            localStorage.setItem("students", JSON.stringify(students));
            displayStudents();
            rollInput.value = "";
            showTotalStudents();
        });
    }

});


function displayStudents() {
    const tbody = document.getElementById("studentTableBody");
    if(!tbody) return;

    tbody.innerHTML = "";

    if (students.length === 0) {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = "No students found";
        row.cells[0].colSpan = 6;
        row.cells[0].style.textAlign = "center";
        row.cells[0].style.color = "#999";
        row.cells[0].style.fontStyle = "italic";
        return;
    }

    students.forEach((student, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = student.name;
        row.insertCell(1).textContent = student.roll;
        row.insertCell(2).textContent = student.marks;
        row.insertCell(3).textContent = student.course;
        row.insertCell(4).textContent = student.status;

        const actionsCell = row.insertCell(5);

        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.className = "btn-update";
        updateBtn.onclick = () => updateStudent(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "btn-delete";
        deleteBtn.onclick = () => deleteStudentByIndex(index);

        actionsCell.appendChild(updateBtn);
        actionsCell.appendChild(deleteBtn);
    });
}

function deleteStudentByIndex(index) {
    if(confirm(`Are you sure you want to delete ${students[index].name}?`)){
        rollNum.delete(students[index].roll);
        students.splice(index, 1);
        localStorage.setItem("students", JSON.stringify(students));
        displayStudents();
        showTotalStudents();
    }
}

function updateStudent(index) {
    const student = students[index];

    const name = prompt("Enter new name:", student.name);
    if(name === null || name.trim() === "") return;

    const rollInput = prompt("Enter new roll number:", student.roll);
    if(rollInput === null || isNaN(rollInput)){
        alert("Roll number must be a number");
        return;
    }

    const roll = parseInt(rollInput);
    if(roll <= 0){
        alert("Roll number must be greater than 0");
        return;
    }

    if(rollNum.has(roll) && roll !== student.roll){
        alert("Roll number already exists. It must be unique.");
        return;
    }

    const marksInput = prompt("Enter new marks:", student.marks);
    if(marksInput === null || isNaN(marksInput)){
        alert("Marks must be a number");
        return;
    }

    const marks = parseInt(marksInput);
    if(marks < 0 || marks > 100){
        alert("Marks must be between 0 and 100");
        return;
    }

    const course = prompt("Enter new course:", student.course);
    if(course === null || course.trim() === "") return;


    rollNum.delete(student.roll);

    student.name = name;
    student.roll = roll;
    student.marks = marks;
    student.course = course;
    student.status = marks >= 40 ? "Pass" : "Fail";

    rollNum.add(roll);

    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
    showTotalStudents();
}