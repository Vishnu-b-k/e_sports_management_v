const form = document.getElementById("esportsForm");
    const output = document.getElementById("output");
    const labels = document.querySelectorAll(".time-slot-label");

    // Highlight selected timeslot 
    labels.forEach(label => {
      label.addEventListener("click", () => {
        labels.forEach(l => l.classList.remove("active-time"));
        label.classList.add("active-time");
      });
    });

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const game = document.querySelector("#game").value;
      const time = document.querySelector("input[name='time']:checked");

      output.innerHTML = `
        <p class="text-blue-300"><span class="font-bold">NAME:</span> ${name}</p>
        <p class="text-blue-300"><span class="font-bold">EMAIL:</span> ${email}</p>
        <p class="text-blue-300"><span class="font-bold">GAME:</span> ${game}</p>
        <p class="text-blue-300"><span class="font-bold">TIME SLOT:</span> ${time ? time.value : "Not selected"}</p>
      `;
      output.classList.remove("hidden");
    });