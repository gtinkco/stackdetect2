document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const companyInput = document.getElementById("company");
    const stackList = document.getElementById("stack-list");


    // script.js

document.getElementById('search-btn').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    const industry = document.getElementById('industry-filter').value;
    const traffic = document.getElementById('traffic-filter').value;
    const region = document.getElementById('region-filter').value;
  
    // Simulate fetching data
    alert(`Searching for "${query}" with filters:
    Industry: ${industry || "Any"}, 
    Traffic: ${traffic || "Any"}, 
    Region: ${region || "Any"}`);
  });
  
  document.getElementById('export-csv').addEventListener('click', () => {
    alert('Exporting results as CSV...');
  });
  
  document.getElementById('export-pdf').addEventListener('click', () => {
    alert('Exporting results as PDF...');
  });
  
  document.getElementById('export-json').addEventListener('click', () => {
    alert('Exporting results as JSON...');
  });
  
    // Fetch and display company tech stack
    const fetchCompanyStack = (company) => {
        stackList.innerHTML = "<p>Loading...</p>"; // Placeholder
        fetch(`/api/company-stack?company=${encodeURIComponent(company)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                stackList.innerHTML = ""; // Clear placeholder
                if (data.length === 0) {
                    stackList.innerHTML = "<p>No data found for the company.</p>";
                } else {
                    data.forEach((stack) => {
                        const stackItem = document.createElement("div");
                        stackItem.className = "stack-item";
                        stackItem.innerHTML = `
                            <h3>${stack.name}</h3>
                            <p>${stack.description}</p>
                        `;
                        stackList.appendChild(stackItem);
                    });
                }
            })
            .catch((error) => {
                stackList.innerHTML = "<p>Error fetching data. Please try again later.</p>";
                console.error("Error fetching company stack:", error);
            });
    };

    // Event listener for search button
    searchBtn.addEventListener("click", () => {
        const companyName = companyInput.value.trim();
        if (companyName) {
            fetchCompanyStack(companyName);
        } else {
            alert("Please enter a company name.");
        }
    });

    const marketplaceSelector = document.getElementById("marketplace");
    const techStackList = document.getElementById("tech-stack-list");

    // Fetch and display tech stacks
    const fetchTechStacks = (marketplace) => {
        techStackList.innerHTML = "<p>Loading...</p>"; // Placeholder
        fetch(`/techstack/data?marketplace=${encodeURIComponent(marketplace)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                techStackList.innerHTML = ""; // Clear placeholder
                if (data.length === 0) {
                    techStackList.innerHTML = "<p>No trending tech stacks found.</p>";
                } else {
                    data.forEach((stack) => {
                        const stackItem = document.createElement("div");
                        stackItem.className = "tech-stack-item";
                        stackItem.innerHTML = `
                            <h3>${stack.name}</h3>
                            <p>${stack.description}</p>
                        `;
                        techStackList.appendChild(stackItem);
                    });
                }
            })
            .catch((error) => {
                techStackList.innerHTML = "<p>Error loading tech stacks. Please try again later.</p>";
                console.error("Error fetching tech stacks:", error);
            });
    };

    // Event listener for marketplace change
    marketplaceSelector.addEventListener("change", (event) => {
        fetchTechStacks(event.target.value);
    });

    // Initial fetch for the default marketplace
    fetchTechStacks(marketplaceSelector.value);

    document.getElementById("api-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const url = document.getElementById("url").value;
        const method = document.getElementById("method").value;
        const headers = document.getElementById("headers").value
            ? JSON.parse(document.getElementById("headers").value)
            : {};
        const body = document.getElementById("body").value;

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: method === "GET" ? null : body ? JSON.stringify(JSON.parse(body)) : null,
        };

        const startTime = Date.now();

        try {
            const response = await fetch(url, options);
            const responseText = await response.text();
            const responseTime = Date.now() - startTime;

            document.getElementById("status").innerText = `Status Code: ${response.status} ${response.statusText}`;
            document.getElementById("response-body").innerText = responseText;
            document.getElementById("response-time").innerText = `Response Time: ${responseTime} ms`;
            document.querySelector(".response").style.display = "block";
        } catch (error) {
            document.getElementById("status").innerText = `Error: ${error.message}`;
            document.getElementById("response-body").innerText = "";
            document.getElementById("response-time").innerText = "";
            document.querySelector(".response").style.display = "block";
            console.error("Error submitting API request:", error);
        }
    });

    // Scroll to bottom of the page
    function scrollToBottom() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }

    // Scroll to top of the page
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Show scroll buttons based on scroll position
    window.onscroll = () => {
        const scrollToBottomButton = document.querySelector(".scroll-to-bottom");
        const scrollToTopButton = document.querySelector(".scroll-to-top");

        if (document.documentElement.scrollTop > 100) {
            scrollToTopButton.classList.add("show-scroll-to-top");
        } else {
            scrollToTopButton.classList.remove("show-scroll-to-top");
        }

        if (document.documentElement.scrollTop < 100) {
            scrollToBottomButton.style.display = "block";
        } else {
            scrollToBottomButton.style.display = "none";
        }
    };
});
