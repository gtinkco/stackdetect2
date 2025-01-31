document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("search-btn");
    const companyInput = document.getElementById("company");
    const stackList = document.getElementById("stack-list");
    const marketplaceSelector = document.getElementById("marketplace");
    const techStackList = document.getElementById("tech-stack-list");
    const apiForm = document.getElementById("api-form");

    // Helper function to fetch and display data
    const fetchData = async (url, placeholder, callback) => {
        placeholder.innerHTML = "<p>Loading...</p>";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            placeholder.innerHTML = ""; // Clear loading message
            callback(data);
        } catch (error) {
            placeholder.innerHTML = "<p>Error fetching data. Please try again later.</p>";
            console.error("Error fetching data:", error);
        }
    };

    // Fetch and display the company tech stack
    const fetchCompanyStack = (company) => {
        const url = `/api/company-stack?company=${encodeURIComponent(company)}`;
        fetchData(url, stackList, (data) => {
            if (!data || data.length === 0) {
                stackList.innerHTML = "<p>No tech stack data found for this company.</p>";
            } else {
                data.forEach((stackItem) => {
                    const itemDiv = document.createElement("div");
                    itemDiv.className = "stack-item";
                    itemDiv.innerHTML = `
                        <h3>${stackItem.name}</h3>
                        <p>${stackItem.description}</p>
                    `;
                    stackList.appendChild(itemDiv);
                });
            }
        });
    };

    // Event listener for the search button
    searchBtn.addEventListener("click", () => {
        const companyName = companyInput.value.trim();
        if (companyName) {
            fetchCompanyStack(companyName);
        } else {
            alert("Please enter a company name.");
        }
    });

    // Fetch and display tech stacks for the selected marketplace
    const fetchTechStacks = (marketplace) => {
        const url = `/techstack/data?marketplace=${encodeURIComponent(marketplace)}`;
        fetchData(url, techStackList, (data) => {
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
        });
    };

    // Event listener for marketplace selection
    marketplaceSelector.addEventListener("change", (event) => {
        fetchTechStacks(event.target.value);
    });

    // Initial fetch for the default marketplace
    fetchTechStacks(marketplaceSelector.value);

    // API testing form submission
    apiForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const url = document.getElementById("url").value;
        const method = document.getElementById("method").value;
        const headersInput = document.getElementById("headers").value;
        const bodyInput = document.getElementById("body").value;

        const headers = headersInput ? JSON.parse(headersInput) : {};
        const body = method === "GET" ? null : bodyInput ? JSON.stringify(JSON.parse(bodyInput)) : null;

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body,
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

    // Scroll functionality
    const scrollToBottomButton = document.querySelector(".scroll-to-bottom");
    const scrollToTopButton = document.querySelector(".scroll-to-top");

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    window.onscroll = () => {
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

    scrollToBottomButton.addEventListener("click", scrollToBottom);
    scrollToTopButton.addEventListener("click", scrollToTop);

    // Placeholder for the initial content
    stackList.innerHTML = "<p>Enter a company name to see its tech stack.</p>";
});
