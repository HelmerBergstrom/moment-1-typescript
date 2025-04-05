interface CourseInfo {
    code: string;
    coursename: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
}   

let courses: CourseInfo[] = [];

window.addEventListener("DOMContentLoaded", async () => {
    const storedCourses = localStorage.getItem("courses")

    if (!storedCourses) {
        const courses = await fetchCourses();
        displayCourses(courses);
    } else {
        courses = JSON.parse(storedCourses);
        displayCourses(courses);
    }
});

async function fetchCourses(): Promise<CourseInfo[]> {
    // Hämtar från localstorage om informationen finns där först. 
    const localStorageData = localStorage.getItem("courses");
    
    if(localStorageData) {
        console.log(localStorageData)
        return JSON.parse(localStorageData) as CourseInfo[];
    }

    try {
        const response = await fetch("https://webbutveckling.miun.se/files/ramschema_ht24.json");

        if(!response.ok) {
            throw new Error('Fel!')
        }
        
        const courses: CourseInfo[] = await response.json();

        // Lagrar i localstorage.
        localStorage.setItem("courses", JSON.stringify(courses))

        console.log(courses)
        return courses;
    } catch (error) {
        console.error('Fel ', error);
        return []; // Promise fungerar ej om funktionen kan returnera något annat än en Array, därav tom array.
    }  
};

function displayCourses(courses: CourseInfo[]) {
    const coursesEl = document.getElementById("courses") as HTMLTableSectionElement;

    if(!coursesEl) return;
    
    coursesEl.innerHTML = ""; 

    courses.forEach(course => {
        const row = document.createElement("tr") as HTMLTableRowElement;

        row.innerHTML = `
            <td style="text-transform: uppercase"> ${course.code} </td>
            <td> ${course.coursename} </td>
            <td id="progressionId"> ${course.progression} </td>
            <td><a href=${course.syllabus}> Länk till kursplan </td>
        `
        coursesEl.appendChild(row);
    })
};

const formEl = document.getElementById("addCourseForm") as HTMLFormElement;

formEl.addEventListener("submit", (event) => {
    event.preventDefault(); // Detta för att sidan inte ska laddas om vid klick på submit-knappen!

    const code = (document.getElementById("courseCode") as HTMLInputElement).value.toUpperCase();
    const coursename = (document.getElementById("courseName") as HTMLInputElement).value;
    const progression = (document.getElementById("progression") as HTMLSelectElement).value as 'A' | 'B' | 'C';
    const syllabus = (document.getElementById("courseSyllabus") as HTMLInputElement).value;

    if(progression !== 'A' && progression !== 'B' && progression !== 'C') {
        alert("Välj en giltlig progression")
        return;
    }
    // Kontrollerar om koden redan finns registrerad.
    const ifExists = courses.some(c => c.code === code);
    if(ifExists) {
        alert("Kurskoden är redan registrerad!")
        return;
    }

    const newCourse: CourseInfo = {
        code,
        coursename,
        progression,
        syllabus,
    };

    courses.push(newCourse);
    localStorage.setItem("courses", JSON.stringify(courses));

    displayCourses(courses);

    formEl.reset();
})