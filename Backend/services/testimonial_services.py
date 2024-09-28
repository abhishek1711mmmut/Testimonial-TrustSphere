from flask import request, jsonify
import cloudinary.uploader
from config.database import mysql

def create_testimonial_logic():
    try:
        # Extract form data
        space_id = request.form.get('spaceId')
        rating = request.form.get('rating')
        reviewer_name = request.form.get('reviewerName')
        reviewer_email = request.form.get('reviewerEmail')
        review = request.form.get('review')

        if not space_id or not rating or not reviewer_name or not reviewer_email:
            return jsonify({"message": "Please fill all the required fields", "success": "false"}), 400

        # Handle optional file uploads (reviewer image, attached images, and video)
        reviewer_image_file = request.files.get('reviewerImage')
        attached_images = request.files.getlist('attachedImages')  # List of images
        video_file = request.files.get('video')

        # Check valid image file type
        if reviewer_image_file:
            if not reviewer_image_file.content_type.startswith('image/'):
                return jsonify({"message": "Invalid image file type", "success": "false"}), 400

        type = 'text'
        # Check valid video file type
        if video_file:
            if not video_file.content_type.startswith('video/'):
                return jsonify({"message": "Invalid video file type", "success": "false"}), 400
            else:
                type = 'video'


        cursor = mysql.connection.cursor()
        # Fetch the space's current review counts and user plan
        cursor.execute("SELECT spaces.text_review_count, spaces.video_review_count, plans.max_text_reviews_per_space, plans.max_video_reviews_per_space FROM spaces JOIN users ON spaces.user_id=users.id JOIN plans ON users.plan_id = plans.id WHERE spaces.id = %s", (space_id,))
        space_review_counts = cursor.fetchone()
        text_review_count, video_review_count, max_text_reviews_per_space, max_video_reviews_per_space = space_review_counts
        # Check if user has reached the maximum number of testimonials allowed
        if text_review_count >= max_text_reviews_per_space:
            return jsonify({"message": "Text review limit reached for this space", "success": "false"}), 400
        elif video_review_count >= max_video_reviews_per_space:
            return jsonify({"message": "Video review limit reached for this space", "success": "false"}), 400
        # Check is testimonial already exists for the space for the user for that type
        cursor.execute("SELECT * FROM testimonials WHERE space_id = %s AND reviewer_email = %s AND type = %s", (space_id, reviewer_email, type))
        existing_testimonial = cursor.fetchone()
        if existing_testimonial:
            return jsonify({"message": "You have already submitted a testimonial", "success": "false"}), 400

        # Upload reviewer image to Cloudinary if provided
        reviewer_image_url = None
        if reviewer_image_file:
            upload_result = cloudinary.uploader.upload(reviewer_image_file, folder="Testimonials")
            reviewer_image_url = upload_result['secure_url']

        # Check if there is atached images and upload attached images and store URLs in a comma-separated string
        attached_images_urls = []
        if attached_images:
            for image in attached_images:
                upload_result = cloudinary.uploader.upload(image, folder="Testimonials")
                attached_images_urls.append(upload_result['secure_url'])

        attached_images_str = ','.join(attached_images_urls)  # Store as a comma-separated string

        # Upload video to Cloudinary if provided
        video_url = None
        if video_file:
            upload_result = cloudinary.uploader.upload(video_file, resource_type="video", folder="Testimonials")
            video_url = upload_result['secure_url']

        # Insert testimonial into database
        insert_query = '''
        INSERT INTO testimonials (space_id, rating, reviewer_name, reviewer_email, reviewer_image, review, attached_images, video, type)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(insert_query, (space_id, rating, reviewer_name, reviewer_email, reviewer_image_url, review, attached_images_str, video_url, type))
        # Increase the space's review count
        if type == "text":
            cursor.execute("UPDATE spaces SET text_review_count = text_review_count + 1 WHERE id = %s", (space_id,))
        elif type == "video":
            cursor.execute("UPDATE spaces SET video_review_count = video_review_count + 1 WHERE id = %s", (space_id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "Testimonial created successfully", "success": "true"}), 201

    except Exception as e:
        return jsonify({"error": str(e), "message": "Unable to create testimonial", "success": "false"}), 500


def get_all_testimonials_by_spaceId_logic(space_id):
    if not space_id:
        return jsonify({"message": "Space ID is required", "success": "false"}), 400
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM testimonials WHERE space_id = %s ORDER BY created_at DESC", (space_id,))
        results = cursor.fetchall()
        cursor.close()
        # Convert the list of tuples to a list of dictionaries
        testimonials=[]
        for row in results:
            testimonial={
                 "id": row[0],
                "rating": row[1],
                "reviewer_name": row[2],
                "reviewer_email": row[3],
                "reviewer_image": row[4],
                "review": row[5],
                "attached_images": row[6].split(",") if row[6] else [],  # Split comma-separated attached images
                "video": row[7],
                "created_at": row[8],  # Format created_at as desired
                "space_id": row[9],
                "type": row[10]
            }
            testimonials.append(testimonial)
        return jsonify({"data": testimonials,"success": "true", "message": "Testimonials retrieved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "success": "false", "message": "Unable to get all testimonials of space"}), 500


def get_testimonial_by_id_logic(testimonial_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM testimonials WHERE id = %s", (testimonial_id,))
        result = cursor.fetchone()
        cursor.close()
        return jsonify({"data": result, "success": "true", "message": "Testimonial retrieved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e), "success": "false", "message": "Unable to get testimonial by id"}), 500


def delete_testimonial_logic(testimonial_id, space_id):
    if not testimonial_id:
        return jsonify({"message": "Testimonial ID is required", "success": "false"}), 400
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM testimonials WHERE id = %s", (testimonial_id,))
        mysql.connection.commit()
        cursor.close()
        # return the updated testimonials list
        return get_all_testimonials_by_spaceId_logic(space_id)
    except Exception as e:
        return jsonify({"error": str(e), "success": "false", "message": "Unable to delete testimonial"}), 500