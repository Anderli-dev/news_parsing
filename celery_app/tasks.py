import time

from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

from backend import celery_app, db
from backend.models import NewsPreview, News
from celery_app.selenium_utils import get_header, get_post_url, get_preview, get_time, get_img, get_post_data, \
    GetOutOfLoop


@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(1.0*60*60, parsing.s(), name='get posts')


@celery_app.task
def parsing():
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(options=chrome_options)
    driver.maximize_window()

    driver.get("https://www.bbc.com/news/world/africa")

    lats_parsed = NewsPreview.query.filter_by(is_parsed=True).order_by(NewsPreview.posted_at.desc()).first()

    try:
        while True:
            elements = driver.find_elements(By.CLASS_NAME, 'lx-stream__post-container')

            for element in elements:
                print("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||")
                is_preview = False

                article = element.find_element(By.XPATH, '*')

                # get header
                header = get_header(article)
                print("Preview header: "+header)

                # get post
                try:
                    url = get_post_url(article)

                    if 'https://www.bbc.com/news/' in url:
                        post_header, body = get_post_data(url)
                        # print("Post header: " + post_header)
                        # print(body)
                    else:
                        # print("---------------Body of post not BBC site!---------------")
                        continue
                except NoSuchElementException:
                    is_preview = True
                    # print("--------------------Post only preview!--------------------")

                # get body of preview
                body_div = article.find_element(By.CSS_SELECTOR, 'div.gs-u-mb\+.gel-body-copy.qa-post-body')
                body_div = body_div.find_element(By.TAG_NAME, 'div')
                body_divs = body_div.find_elements(By.TAG_NAME, 'div')

                try:
                    body_div.find_element(By.TAG_NAME, 'img')
                except NoSuchElementException:
                    # print("---------------Post without img!---------------")
                    continue

                # get img
                img = get_img(body_divs[0], is_preview, article)
                # print("Image: "+img)

                # get time
                datetime_odj = get_time(article)
                date = datetime_odj.strftime("%Y-%m-%dT%H:%M:%S")
                # print("Date: "+str(date))

                # get preview
                if not is_preview:
                    preview = body_divs[2]
                else:
                    preview = body_div

                preview = get_preview(preview)
                # print("Preview:")
                # print(preview)

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

                    db.session.add(preview)
                    db.session.flush()
                    db.session.refresh(preview)

                    if not is_preview:
                        post = News(title=post_header,
                                    text=body,
                                    preview_id=preview.id)
                        db.session.add(post)

                    db.session.commit()

            btn = driver.find_element(By.XPATH, "//a[@rel='next']")

            btn.click()
            time.sleep(2)
    except GetOutOfLoop:
        pass
