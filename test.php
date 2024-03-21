<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $recipient = $_POST['recipient'];
    $sender = $_POST['sender'];
    $message = $_POST['message'];

    // Отправляем сообщение
    $subject = "Новое сообщение от $sender";
    $headers = "From: $sender";
    mail($recipient, $subject, $message, $headers);
    
    // Перенаправляем пользователя после отправки сообщения
    header("Location: index.php"); // Замените index.php на страницу, на которую вы хотите перенаправить пользователя
    exit();
}
?>

<!-- 

<div class="modal-body">
    <form id="emailForm" action="send_email.php" method="post">
        <div class="mb-3">
            <label for="recipient-name" class="col-form-label">Получатель: juliakriv0137@gmail.com</label>
            <input type="text" class="form-control" id="recipient-name" name="recipient" value="juliakriv0137@gmail.com" hidden>
        </div>
        <div class="mb-3">
            <label for="sender-name" class="col-form-label">Ваше имя:</label>
            <input type="text" class="form-control" id="sender-name" name="sender">
        </div>
        <div class="mb-3">
            <label for="message-text" class="col-form-label">Сообщение:</label>
            <textarea class="form-control" id="message-text" name="message"></textarea>
        </div>
    </form>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Закрыть</button>
    <button type="submit" form="emailForm" class="btn btn-danger">Отправить сообщение</button>
</div>


 -->