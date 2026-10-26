
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# للتطوير المحلي فقط.
# سنحدد مصادر الواجهة المسموح لها عند النشر.
CORS(app)

COURSES = [
    {
        "id": 1,
        "title": "أساسيات الأمن السيبراني",
        "level": "مبتدئ",
        "description": "مفاهيم الأمن السيبراني والتهديدات وطرق الحماية.",
        "lessons": 12,
        "questions": 40
    },
    {
        "id": 2,
        "title": "الشبكات وبروتوكولاتها",
        "level": "مبتدئ",
        "description": "فهم الشبكات وIP وDNS وTCP وHTTP.",
        "lessons": 15,
        "questions": 40
    },
    {
        "id": 3,
        "title": "Linux وسطر الأوامر",
        "level": "مبتدئ",
        "description": "إدارة الملفات والصلاحيات والأوامر الأساسية.",
        "lessons": 12,
        "questions": 40
    },
    {
        "id": 4,
        "title": "أمن تطبيقات الويب",
        "level": "متوسط",
        "description": "فهم ثغرات الويب وطرق اكتشافها ومعالجتها في بيئات تدريبية.",
        "lessons": 15,
        "questions": 40
    },
    {
        "id": 5,
        "title": "الدفاع ومراقبة الأنظمة",
        "level": "متوسط",
        "description": "السجلات ومراقبة الأحداث والاستجابة للحوادث.",
        "lessons": 12,
        "questions": 40
    },
    {
        "id": 6,
        "title": "التشفير وحماية البيانات",
        "level": "متوسط",
        "description": "مبادئ التشفير والتجزئة وإدارة المفاتيح.",
        "lessons": 10,
        "questions": 40
    }
]


@app.get("/")
def home():
    return jsonify({
        "name": "Cyber Academy API",
        "status": "running",
        "version": "1.0.0"
    })


@app.get("/api/health")
def health():
    return jsonify({
        "success": True,
        "message": "الخادم يعمل بنجاح"
    })


@app.get("/api/courses")
def get_courses():
    return jsonify({
        "success": True,
        "count": len(COURSES),
        "courses": COURSES
    })


@app.get("/api/courses/<int:course_id>")
def get_course(course_id):
    course = next(
        (item for item in COURSES if item["id"] == course_id),
        None
    )

    if course is None:
        return jsonify({
            "success": False,
            "message": "القسم غير موجود"
        }), 404

    return jsonify({
        "success": True,
        "course": course
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "success": False,
        "message": "المسار المطلوب غير موجود"
    }), 404


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
