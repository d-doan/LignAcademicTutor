import time
from openai import OpenAI

class AssistantWrapper:
    _instance = None

    def __new__(cls, api_key):
        if cls._instance is None:
            cls._instance = super(AssistantWrapper, cls).__new__(cls)
            cls._instance.client = OpenAI(api_key=api_key)
            cls._instance.assistant_id = "asst_O1ZFyJ4CoYX9rfUqMy3AnV8O"
            cls._instance.threads = {}
        return cls._instance

    @classmethod
    def thread_exist(cls, topic):
        return topic in cls._instance.threads

    @classmethod
    def create_thread(cls,topic,prompt):
        thread = cls._instance.client.beta.threads.create()
        my_thread_id = thread.id

        message = cls._instance.client.beta.threads.messages.create(
            thread_id=my_thread_id,
            role="user",
            content=prompt
        )

        run = cls._instance.client.beta.threads.runs.create(
            thread_id=my_thread_id,
            assistant_id=cls._instance.assistant_id
        )
        return run.id, thread.id

    @classmethod
    def check_status(cls,run_id,thread_id):
        run = cls._instance.client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run_id,
        )
        return run.status

    @classmethod
    def make_call(cls,topic,prompt):
        my_run_id, my_thread_id = AssistantWrapper.create_thread(cls._instance.assistant_id, prompt)
        status = AssistantWrapper.check_status(my_run_id,my_thread_id)

        while (status != "completed"):
            status = AssistantWrapper.check_status(my_run_id,my_thread_id)
            time.sleep(2)

        response = cls._instance.client.beta.threads.messages.list(thread_id=my_thread_id)
        return response
