import time

from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from backend import db, app
from backend.models import NewsPreview, News
from parsing_app.selenium_utils import get_header, get_post_url, get_preview, get_time, get_img, get_post_data, \
    GetOutOfLoop


def parsing():
    with app.app_context():
        # Selenium settings
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")

        driver = webdriver.Chrome(options=chrome_options)
        driver.maximize_window()

        driver.get("https://www.bbc.com/news/world/"+app.config['PARSING_REGION'])

        lats_parsed = NewsPreview.query.filter_by(is_parsed=True).order_by(NewsPreview.posted_at.desc()).first()

        pag_page = 1
        # Parsing logic
        try:
            while True:
                elements = driver.find_elements(By.XPATH, ".//div[@data-testid='liverpool-card']")
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                for element in elements:

                    print("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
                    is_preview = False

                    # get header
                    header = get_header(element)
                    print("Preview header: "+header)

                    # get post
                    try:
                        url = get_post_url(element)
                        print("URL:", url)

                        if 'https://www.bbc.com/news/articles/' in url:
                            post_header, body = get_post_data(url)
                            print("Post header: " + post_header)
                            print("Post body:")
                            print(body)
                        else:
                            print("---------------Body of post not BBC site!---------------")
                            continue
                    except NoSuchElementException:
                        is_preview = True
                        print("--------------------Post only preview!--------------------")

                    # get img
                    try:
                        element.find_element(By.XPATH, "//div[@data-testid='card-media']")
                    except NoSuchElementException:
                        print("---------------Post without img!---------------")
                        continue

                    img = get_img(element.find_element(By.XPATH, ".//div[@data-testid='card-media']"), is_preview, element)
                    print("Image: "+img)

                    # get time
                    datetime_odj = get_time(element)
                    date = datetime_odj.strftime("%Y-%m-%dT%H:%M:%S")
                    print("Date: "+str(date))

                    # get preview
                    # Currently BBC don`t use preview posts

                    preview = get_preview(element)
                    print("Preview:")
                    print(preview)

                    print(lats_parsed)

                    # add to db logic
                    # TODO create func
                    if header == lats_parsed.title:
                        raise GetOutOfLoop
                    else:
                        preview = NewsPreview(
                            img=img,
                            title=header,
                            posted_at=date,
                            preview=preview,
                            user_id=None,
                            is_parsed=True
                        )

                        # db.session.add(preview)
                        # db.session.flush()
                        # db.session.refresh(preview)
                        #
                        # if not is_preview:
                        #     try:
                        #         post = News(title=post_header,
                        #                     text=body,
                        #                     preview_id=None)
                        #     except:
                        #         db.session.rollback()
                        #         continue
                        #     else:
                        #         post.preview_id = preview.id
                        #         db.session.add(post)
                        #
                        # db.session.commit()

                try:
                    btn = driver.find_element(By.XPATH, ".//button[@data-testid='pagination-next-button']")
                    if pag_page < 11:
                        btn.click()
                        pag_page = pag_page+1
                    else:
                        raise GetOutOfLoop
                except NoSuchElementException:
                    raise GetOutOfLoop

                time.sleep(2)

        except GetOutOfLoop:
            pass
