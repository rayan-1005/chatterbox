const api_key = process.env.GIPHY_API_KEY;
export const searchGIF = async (req, res) => {
	try {
		const query = req.query.q;
		const limit = req.query.limit || 25;
		if (!query) {
			return res
				.status(400)
				.json({ message: "Query parameter 'q' is required" });
		}

		const response = await fetch(
			`https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${encodeURIComponent(query)}&limit=${limit}`,
		);
		if (!response.ok) {
			return res.status(404).json({ message: "GIF not found" });
		}

		const data = await response.json();
		res.status(200).json(data.data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
