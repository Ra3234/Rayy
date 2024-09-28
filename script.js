// بيانات تسجيل الدخول
const validUsername = "admin";
const validPassword = "password123";

// التعامل مع تسجيل الدخول
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === validUsername && password === validPassword) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('tripFormSection').style.display = 'block';
  } else {
    document.getElementById('errorMessage').style.display = 'block';
  }
}

// إضافة راكب جديد
function addPassenger() {
  const passengerSection = document.getElementById('passengerSection');
  const passengerDiv = document.createElement('div');
  passengerDiv.classList.add('passenger');

  const name = document.createElement('input');
  name.setAttribute('type', 'text');
  name.setAttribute('placeholder', 'اسم الراكب');
  name.required = true;

  const paymentStatus = document.createElement('select');
  paymentStatus.innerHTML = `
    <option value="مدفوع">مدفوع</option>
    <option value="غير مدفوع">غير مدفوع</option>
  `;

  const removeButton = document.createElement('button');
  removeButton.innerText = 'إزالة';
  removeButton.onclick = function() {
    passengerSection.removeChild(passengerDiv);
    updateTotals();
  };

  passengerDiv.appendChild(name);
  passengerDiv.appendChild(paymentStatus);
  passengerDiv.appendChild(removeButton);

  passengerSection.appendChild(passengerDiv);
  updateTotals();
}

// إضافة رسالة جديدة
function addParcel() {
  const parcelSection = document.getElementById('parcelSection');
  const parcelDiv = document.createElement('div');
  parcelDiv.classList.add('parcel');

  const parcelType = document.createElement('input');
  parcelType.setAttribute('type', 'text');
  parcelType.setAttribute('placeholder', 'نوع الرسالة');
  parcelType.required = true;

  const senderName = document.createElement('input');
  senderName.setAttribute('type', 'text');
  senderName.setAttribute('placeholder', 'اسم المرسل');
  senderName.required = true;

  const recipientName = document.createElement('input');
  recipientName.setAttribute('type', 'text');
  recipientName.setAttribute('placeholder', 'اسم المستلم');
  recipientName.required = true;

  const removeButton = document.createElement('button');
  removeButton.innerText = 'إزالة';
  removeButton.onclick = function() {
    parcelSection.removeChild(parcelDiv);
    updateTotals();
  };

  parcelDiv.appendChild(parcelType);
  parcelDiv.appendChild(senderName);
  parcelDiv.appendChild(recipientName);
  parcelDiv.appendChild(removeButton);

  parcelSection.appendChild(parcelDiv);
  updateTotals();
}

// تحديث الإجماليات
function updateTotals() {
  const totalPassengers = document.querySelectorAll('#passengerSection .passenger').length;
  const totalParcels = document.querySelectorAll('#parcelSection .parcel').length;
  
  document.getElementById('totalPassengers').textContent = totalPassengers;
  document.getElementById('totalParcels').textContent = totalParcels;
}

// التعامل مع إرسال البيانات
document.getElementById('tripForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const tripDate = document.getElementById('tripDate').value;
  const driver = document.getElementById('driver').value;
  const direction = document.getElementById('direction').value;

  const passengers = [];
  document.querySelectorAll('.passenger').forEach(passengerDiv => {
    const name = passengerDiv.querySelector('input[placeholder="اسم الراكب"]').value;
    const paymentStatus = passengerDiv.querySelector('select').value;
    passengers.push({ name, paymentStatus });
  });

  const parcels = [];
  document.querySelectorAll('.parcel').forEach(parcelDiv => {
    const parcelType = parcelDiv.querySelector('input[placeholder="نوع الرسالة"]').value;
    const senderName = parcelDiv.querySelector('input[placeholder="اسم المرسل"]').value;
    const recipientName = parcelDiv.querySelector('input[placeholder="اسم المستلم"]').value;
    parcels.push({ parcelType, senderName, recipientName });
  });

  // إرسال البيانات عبر SMTP.js
  Email.send({
    SecureToken: "your-smtp-token",
    To: 'darbalsalamamanagement@gmail.com',
    From: "your-email@example.com",
    Subject: "بيانات الرحلة الجديدة",
    Body: `
      <strong>تاريخ الرحلة:</strong> ${tripDate} <br>
      <strong>السائق:</strong> ${driver} <br>
      <strong>اتجاه الرحلة:</strong> ${direction} <br>
      <strong>الركاب:</strong> ${passengers.map(p => `${p.name} - ${p.paymentStatus}`).join(', ')} <br>
      <strong>تفاصيل الرسائل:</strong> <br>
      ${parcels.map(parcel => `
        <strong>نوع الرسالة:</strong> ${parcel.parcelType} <br>
        <strong>اسم المرسل:</strong> ${parcel.senderName} <br>
        <strong>اسم المستلم:</strong> ${parcel.recipientName} <br><br>
      `).join('')}
    `
  }).then(
    message => alert('تم إرسال البيانات بنجاح!')
  );
});
