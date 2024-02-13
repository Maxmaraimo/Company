from django.urls import path

from .views import *


urlpatterns = [
    path("", WorksListView.as_view(), name="books_view"),
    path("add_jobs", AddWorkView.as_view(), name="add_book"),
    path("update_work/<int:pk>", JobsUpdateView.as_view(), name="update_book"),
    path("work_details/<int:pk>", WorksDetailsView.as_view(), name="book_details"),
    path("delete_work/<int:book_id>", delete_book, name="delete_book"),
    path('add_to_wishlist/<int:book_id>',
         add_to_wishlist, name="add_to_wishlist"),
]