using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Web.Pages
{
	/// <summary>
	/// ErrorModel
	/// </summary>
	[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
	public class ErrorModel : PageModel
	{
		/// <summary>
		/// RequestId
		/// </summary>
		public string RequestId { get; set; }

		/// <summary>
		/// ShowRequestId
		/// </summary>
		public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

		/// <summary>
		/// _logger
		/// </summary>
		private readonly ILogger<ErrorModel> _logger;

		/// <summary>
		/// ¹¹Ôìº¯Êý
		/// </summary>
		/// <param name="logger"></param>
		public ErrorModel(ILogger<ErrorModel> logger)
		{
			_logger = logger;
		}

		/// <summary>
		/// OnGet
		/// </summary>
		public void OnGet()
		{
			RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
			_logger.LogError(RequestId);
		}
	}
}
