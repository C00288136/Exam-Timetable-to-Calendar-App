import PyPDF2
import re
import os

course_code = "CGCON_b"
year = "Year 2"

file_path = os.path.join("static", "assets","timetables", "Faculty_of_Engineering.pdf")
reader = PyPDF2.PdfReader(file_path)

num_pages = len(reader.pages)
search_string_course = course_code.lower()
search_string_year = year.lower()
exam_data = {}
exam_counter = 1

location_regex = re.compile(r'[A-Za-z]\d{3}')

for page in range(num_pages):
    text = reader.pages[page].extract_text()

    if text:
        lower_text = text.lower()
    
    if search_string_course in lower_text and search_string_year in lower_text:
        lines = text.splitlines()

        page_data = []

        for line in lines:
            print(line)
            if line[0:10].count('/') == 2:
                data_parts = line.split()
                for part in data_parts:
                    print(part)
            
                    
                event_data = {
                    "exam_date": data_parts[0],
                    "start_time": data_parts[1],
                    "end_time": data_parts[2],
                    "course_code": data_parts[3],
                    "module": " ".join(data_parts[4:-2]).strip(),
                    "day": data_parts[-2],
                    "location" : ""
                }
                
            
            if location_regex.search(line):
                event_data["location"] += f"{line.strip()}"
                exam_data[exam_counter] = event_data
                exam_counter +=1


            

            
            



if exam_data:
    for key, event in exam_data.items():
        print(f"Exam Key: {key}")
        print(event)
            
    

