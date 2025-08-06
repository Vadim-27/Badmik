namespace BadmintonApp.API.Exceptions
{
    public enum ErrorCode
    {
        NotFound = 1, // 404(можливо варто одразу вказати код, щоб потім не довелося мапити у відповідний код та не обробляти його функцією чи свічом?)
        ValidationFailed = 2,
        AccessDenied = 3,
        InternalError = 4,
        EmailAlreadyUsed = 5, // (чи це не буде помилкою 400? а якщо це всетаки кастомна помилка то мим можемо виводити меседж до помилки унікальний, або вибрати вільний код із знову ж таки із повідомленням про помилку.)
        Conflict = 6, // що тут мається на увазі??
        TokenExpired = 7, // чи не помилка це 401 ??
        AlreadyExists = 8,// 400 (?)/бедреквест/форбіден
        MissingRequiredField = 9, // пишеться на рівні ДТО(required). і система сама не дасть виконатись контроллеру.
        TrainingLevelMismatch = 10 // 400 чи ще якась помилка.. ??
    }
}
