const wsMermaidConfig = {
	startOnLoad: true,
	securityLevel: "loose",
	theme: "default"
}

// Do things inside builder
if ( document.querySelector("html").classList.contains("is-builder") ) {
	wsMermaidConfig.startOnLoad = false;
	mermaid.initialize(wsMermaidConfig);

	// On adding blocks and changing parameters
	$(document).on('add.cards',function(event) {
		if (!$(event.target).hasClass('witsec-mermaid')) return;

		// Not doing this causes an issue, element is possibly not ready yet
		setTimeout(function () {
			wsRenderMermaid(event.target);
		}, 500);
	}).on('changeParameter.cards', function(event, paramName, paramValue) {
		if (!$(event.target).hasClass('witsec-mermaid')) return;

		// Render when config is changed
		if (paramName === "mermaidCode") {
			wsRenderMermaid(event.target);
		}   
	});
} else {
	document.addEventListener("DOMContentLoaded", () => {
		let wsm = document.querySelectorAll(".witsec-mermaid .mermaidCode");
		if (wsm.length !== 0) {
			wsm.forEach(function(m) {
				try {
					let val = m.value;
					let target = m.parentElement.querySelector(".mermaid");
					target.innerHTML = val;
				} catch (err) {
					console.error("Error while loading Mermaid config: " + err.message);
				}
			});
		}

		// Render all Mermaids
		mermaid.initialize(wsMermaidConfig);
	});
}

// Render Mermaid inside builder
async function wsRenderMermaid(block) {
	block = $(block);

	try {
		let val = block.find(".mermaidCode").val();
		block.find(".mermaid").html(val);
		block.find(".mermaid").removeAttr("data-processed"); // Allow re-render of element

		// Render element
		await mermaid.run({
			nodes: block.find(".mermaid")
		});
	} catch (err) {
		console.error("Error in wsRenderMermaid: " + err.message);
	}
}