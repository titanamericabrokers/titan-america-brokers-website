/* ==========================================================================
   TITAN AMERICA BROKERS — main.js
   No dependencies. Nav, scroll reveal, form validation, form submit.
   ========================================================================== */

/* ---------------------------------------------------------------- CONFIG --
   Paste your Formspree endpoint between the quotes to send forms by POST,
   e.g. "https://formspree.io/f/abcdwxyz".
   Leave it blank and every form falls back to opening a pre-filled email
   to FALLBACK_EMAIL instead. Nothing else needs to change.
--------------------------------------------------------------------------- */
var FORMSPREE_ENDPOINT = "https://formspree.io/f/mgawgzla";
var FALLBACK_EMAIL = "info@titanamericabrokers.com";
var PHONE_DISPLAY = "(800) 818-6927";

(function () {
  "use strict";

  /* ------------------------------------------------------------- mobile nav */
  var toggle = document.querySelector(".navtoggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------------------------------------------------- scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ------------------------------------------------------------ footer year */
  var year = document.querySelectorAll("[data-year]");
  year.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------ forms */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  document.querySelectorAll("form[data-form]").forEach(initForm);
  var subjectParam = new URLSearchParams(window.location.search).get("subject");
  var subjectField = document.querySelector("[data-subject-source]");

   if (subjectParam && subjectField) {
     var matchingOption = Array.from(subjectField.options).find(function (option) {
       return option.value === subjectParam;
     });
   
     if (matchingOption) {
       subjectField.value = subjectParam;
     }
   }

  function initForm(form) {
    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("input", function (e) {
      if (e.target.matches("input,select,textarea")) clearError(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: silently accept and stop.
      var trap = form.querySelector('[name="company_website"]');
      if (trap && trap.value.trim() !== "") { showSuccess(form); return; }

      var bad = validate(form);
      if (bad.length) {
        bad[0].focus();
        setStatus(form, "Check the highlighted fields and try again.");
        return;
      }

      send(form);
    });
  }

  function validate(form) {
    var bad = [];
    var fields = form.querySelectorAll("input,select,textarea");

    fields.forEach(function (el) {
      if (el.name === "company_website" || el.type === "hidden") return;
      var value = (el.value || "").trim();
      var label = fieldLabel(el);

      if (el.hasAttribute("required") && value === "") {
        setError(el, label + " is required.");
        bad.push(el);
        return;
      }
      if (value === "") return;

      if (el.type === "email" && !EMAIL_RE.test(value)) {
        setError(el, "Enter a valid email address.");
        bad.push(el);
        return;
      }
      if (el.type === "tel" && value.replace(/\D/g, "").length < 10) {
        setError(el, "Enter a 10-digit phone number.");
        bad.push(el);
      }
    });

    return bad;
  }

  function fieldLabel(el) {
    var wrap = el.closest(".field");
    var lab = wrap ? wrap.querySelector("label") : null;
    return lab ? lab.textContent.replace(/\*/g, "").trim() : "This field";
  }

  function setError(el, message) {
    var wrap = el.closest(".field");
    if (!wrap) return;
    var msg = wrap.querySelector(".field-error");
    if (!msg) {
      msg = document.createElement("p");
      msg.className = "field-error";
      msg.id = (el.name || "field") + "-error";
      wrap.appendChild(msg);
    }
    msg.textContent = message;
    el.setAttribute("aria-invalid", "true");
    el.setAttribute("aria-describedby", msg.id);
  }

  function clearError(el) {
    var wrap = el.closest(".field");
    if (!wrap) return;
    var msg = wrap.querySelector(".field-error");
    if (msg) msg.remove();
    el.removeAttribute("aria-invalid");
    el.removeAttribute("aria-describedby");
  }

  function setStatus(form, text) {
    var status = form.querySelector("[data-status]");
    if (status) status.textContent = text;
  }

  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (key === "company_website") return;
      data[key] = typeof value === "string" ? value.trim() : value;
    });
    return data;
  }

  function send(form) {
    var button = form.querySelector('button[type="submit"]');
    var original = button ? button.textContent : "";
    var data = collect(form);

    if (!FORMSPREE_ENDPOINT) {
      mailtoFallback(form, data);
      return;
    }

    if (button) { button.disabled = true; button.textContent = "Sending…"; }
    setStatus(form, "");

    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        showSuccess(form);
      })
      .catch(function () {
        if (button) { button.disabled = false; button.textContent = original; }
        setStatus(form, "That didn't go through. Call " + PHONE_DISPLAY + " or email " + FALLBACK_EMAIL + ".");
      });
  }

  function mailtoFallback(form, data) {
    var subject = form.getAttribute("data-subject") || "Website request";
    var lines = Object.keys(data).map(function (key) {
      return prettyKey(key) + ": " + (data[key] || "—");
    });
    var href =
      "mailto:" + FALLBACK_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
    showSuccess(form, true);
  }

  function prettyKey(key) {
    return key.replace(/_/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function showSuccess(form, viaEmail) {
    form.classList.add("is-sent");
    var box = form.querySelector(".form-success");
    if (box) {
      if (viaEmail) {
        var note = box.querySelector("[data-email-note]");
        if (note) note.hidden = false;
      }
      box.setAttribute("tabindex", "-1");
      box.focus();
      box.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }
})();
