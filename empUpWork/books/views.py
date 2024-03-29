
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import redirect
from django.views.generic import CreateView, DetailView, ListView, UpdateView

from .forms import BookForm
from .models import Books
from .usecases import *


class AddWorkView(CreateView):
    modal = Books
    form_class = BookForm
    template_name = 'add_work.html'
    success_url = '/jobs/'

    def post(self, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            book = form.save(commit=False)
            book.author = self.request.user
            book.save()
        return redirect('books_view')


class WorksListView(ListView):
    modal = Books
    template_name = 'jobs.html'

    def get_queryset(self):
        return Books.objects.all()


class WorksDetailsView(DetailView):
    modal = Books
    template_name = 'jobs_details.html'

    def get_queryset(self):
        return Books.objects.filter(id=self.kwargs['pk'])


class JobsUpdateView(UserPassesTestMixin, LoginRequiredMixin, UpdateView):
    modal = Books
    form_class = BookForm
    template_name = 'update_work.html'
    success_url = '/jobs/'

    def get_queryset(self):
        return Books.objects.filter(id=self.kwargs['pk'])

    def test_func(self):
        book = self.get_object()
        if self.request.user == book.author:
            return True
        return False


@login_required
def delete_book(request, book_id: int):
    book = Books.objects.get(id=book_id)
    book.delete()
    messages.success(request, 'Work deleted successfully!')
    return redirect('books_view')


@login_required
def add_to_wishlist(request, book_id: int):
    book = Books.objects.get(id=book_id)
    added = send_to_wishlist(request, book_id, 'book')

    if not added:
        messages.success(
            request, f"Successfully added a work {book.title.upper()} into wishlist!")
    else:
        messages.warning(
            request, f"The work {book.title.upper()} already exists in your wishlist!")
    return redirect('books_view')