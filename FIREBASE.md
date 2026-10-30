# Firebase — رواد الإبداع (`roadelebada`)

## ما يتم تخزينه في Firestore

| Path | المحتوى |
|------|---------|
| `settings/company` | الاسم، الهاتف، الواتساب، العنوان، الخرائط، السوشيال، الشعار |
| `settings/website` | إعدادات الموقع |
| `settings/meta` | علامة التهيئة |
| `services/{slug}` | الخدمات + الوصف + التفاصيل + الأمثلة |
| `portfolio/{id}` | الأعمال |
| `posts/{id}` | المدونة |
| `staff/{id}` | الموظفون والصلاحيات |
| `quotes/{id}` | طلبات عرض السعر (من النموذج) |
| `messages/{id}` | رسائل التواصل |

## إعداد Console (مرة واحدة)

1. افتح [Firebase Console](https://console.firebase.google.com/) → مشروع **roadelebada**
2. **Build → Firestore Database** → أنشئ قاعدة (production mode ثم انشر القواعد)
3. **Build → Authentication** → Sign-in method → فعّل **Email/Password**
4. من جهازك (مع [Firebase CLI](https://firebase.google.com/docs/cli)):

```bash
firebase login
firebase use roadelebada
firebase deploy --only firestore:rules
```

أو الصق محتويات `firestore.rules` يدويًا في Rules.

5. سجّل دخول الأدمن من الموقع:
   - البريد: `admin@roadelebada.com`
   - كلمة المرور: `Demo123!`
   - أول دخول ينشئ المستخدم في Auth ويرفع البيانات الافتراضية
6. من **الإعدادات** في لوحة التحكم يمكن إعادة «رفع الخدمات والبيانات إلى Firebase»

## Analytics

يُفعَّل تلقائيًا في المتصفح عبر `measurementId` عند دعمه.

## ملاحظات أمان

- مفتاح الـ API الظاهر في الواجهة طبيعي لتطبيقات الويب؛ الحماية من **قواعد Firestore**.
- الكتابة على الخدمات/الشركة تتطلب تسجيل دخول Auth.
- الزوار يمكنهم فقط **إنشاء** طلب سعر أو رسالة تواصل.
