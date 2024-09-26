from backend import app


def test_posts_route():
    with app.test_client() as c:
        response = c.get('/api/posts')
        json_response = response.get_json()
        # assert json_response == {'msg': 'msg'}
        assert response.status_code == 200


test_posts_route()
