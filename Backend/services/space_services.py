from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from config.database import mysql
import cloudinary.uploader

def create_space_logic():
    user_id = get_jwt_identity()
    space_name = request.form.get('spaceName')
    header_title = request.form.get('headerTitle')
    custom_message = request.form.get('customMessage')
    questions = request.form.getlist('questions')
    company_logo = request.files.get('companyLogo')
    if not space_name or not header_title or not custom_message:
        return jsonify({"message": "Please fill all the required fields", "success": "false"}), 400
    
    try:
        cursor = mysql.connection.cursor()
        # get plan id
        cursor.execute("SELECT plan_id FROM users WHERE id = %s", (user_id,))
        plan_id = cursor.fetchone()[0]
        # check if user has reached the maximum number of spaces allowed
        cursor.execute("SELECT max_spaces FROM plans WHERE id = %s", (plan_id,))
        max_spaces = cursor.fetchone()[0]
        # get user space count
        cursor.execute("SELECT COUNT(*) FROM spaces WHERE user_id = %s", (user_id,))
        user_space_count = cursor.fetchone()[0]
        if user_space_count >= max_spaces:
            return jsonify({"message": "You used up all credits in the free plan", "success": "false"}), 400
        # check if space already exists for that user
        cursor.execute("SELECT * FROM spaces WHERE spaceName = %s AND user_id = %s", (space_name, user_id))
        space = cursor.fetchone()
        if space:
            return jsonify({"message": "Space name already exists", "success": "false"}), 400
        if company_logo:
            # Upload the file to Cloudinary
            upload_result = cloudinary.uploader.upload(company_logo, folder="Testimonials")
            company_logo_url = upload_result['secure_url']  # Get the secure URL from Cloudinary
        else:
            company_logo_url = None  # Handle the case where no logo is provided
        # Execute SQL to insert into space table, associating it with the user_id
        query = """INSERT INTO spaces (user_id, spaceName, companyLogo, headerTitle, customMessage, questions)
                VALUES (%s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (user_id, space_name, company_logo_url, header_title, custom_message, ','.join(questions)))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"success": "true", "message": "Space created successfully", }), 201
    except Exception as e:
        return jsonify({"message": "Unable to create space", "success": "false", "error": str(e)}), 500



def delete_space_logic(space_id):
    user_id = get_jwt_identity()
    try:
        cursor = mysql.connection.cursor()
        # Check if the space exists and belongs to the user
        cursor.execute("SELECT * FROM spaces WHERE id = %s AND user_id = %s", (space_id, user_id))
        space = cursor.fetchone()
        if space is None:
            cursor.close()
            return jsonify({"success":"false", "message": "Space not found"}), 404
        # Delete the company logo if it exists from cloudinary
        if space[2]:
            public_id = space[2].split('/').pop().split('.')[0]
            cloudinary.uploader.destroy("Testimonials/"+public_id, invalidate=True)
        # Delete the space if found and owned by the user
        cursor.execute("DELETE FROM spaces WHERE id = %s AND user_id = %s", (space_id, user_id))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Space deleted successfully", "success": "true"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to delete space", "success": "false", "error": str(e)}), 500



def edit_space_logic(space_id):
    # Extracting data from the request
    user_id = get_jwt_identity()
    # space_id = request.form.get('space_id')
    spaceName = request.form.get('spaceName')
    companyLogo = request.files.get('companyLogo')
    headerTitle = request.form.get('headerTitle')
    customMessage = request.form.get('customMessage')
    questions = request.form.getlist('questions')

    try:
        cursor = mysql.connection.cursor()
        # Check if the space exists and belongs to the user
        cursor.execute("SELECT * FROM spaces WHERE id = %s AND user_id = %s", (space_id, user_id))
        space = cursor.fetchone()
        if space is None:
            cursor.close()
            return jsonify({"message": "Space not found", "success": "false"}), 404
        # Update the space details in the database
        cursor.execute("""
            UPDATE spaces
            SET spaceName = %s, companyLogo = %s, headerTitle = %s, customMessage = %s, questions = %s
            WHERE id = %s AND user_id = %s
        """, (spaceName, companyLogo, headerTitle, customMessage, ",".join(questions), space_id, user_id))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Space updated successfully", "success": "true"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to update space", "success": "false", "error": str(e)}), 500



def get_spaces_logic():
    user_id = get_jwt_identity()
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM spaces WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
        results = cursor.fetchall()
        cursor.close()
        # Convert the list of tuples to a list of dictionaries
        spaces=[]
        for row in results:
            space={
                "id": row[0],
                "spaceName": row[1],
                "companyLogo": row[2],
                "headerTitle": row[3],
                "customMessage": row[4],
                "questions": row[5].split(",") if row[5] else [],  # Split comma-separated questions
                "text_review_count": row[6],
                "video_review_count": row[7],
                "created_at": row[8],  # Format created_at as desired
                "user_id": row[9],
            }
            spaces.append(space)
        return jsonify({"data": spaces, "success": "true"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to get spaces", "success": "false", "error": str(e)}), 500
    


def get_space_by_id_logic(space_id):
    user_id = get_jwt_identity()
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM spaces WHERE id = %s AND user_id = %s", (space_id, user_id))
        space = cursor.fetchone()
        cursor.close()
        return jsonify({"space": space, "success": "true"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to get space", "success": "false", "error": str(e)}), 500