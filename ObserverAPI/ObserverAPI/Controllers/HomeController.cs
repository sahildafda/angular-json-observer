using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ObserverAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public HomeController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpGet]
        public ActionResult<Observation> ReadJsonFromFile()
        {
            try
            {
                string filePath = Path.Combine(_env.ContentRootPath, "Data", "project-data.json");
                string json = System.IO.File.ReadAllText(filePath);
                var observation = JsonConvert.DeserializeObject<Observation>(json);
                return Ok(observation);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error reading file: {ex.Message}");
            }
        }

        [HttpPost("Save")]
        public IActionResult UpdateObservationData(Data updatedData)
        {
            try
            {
                string filePath = Path.Combine(_env.ContentRootPath, "Data", "project-data.json");

                if (!System.IO.File.Exists(filePath))
                    return NotFound("File not found.");

                string json = System.IO.File.ReadAllText(filePath);
                var observation = JsonConvert.DeserializeObject<Observation>(json);

                var existingData = observation.Datas
                    .FirstOrDefault(d => d.SamplingTime == updatedData.SamplingTime);

                if (existingData == null)
                    return NotFound("Sampling time not found.");

                // Replace properties
                existingData.Properties = updatedData.Properties;

                string updatedJson = JsonConvert.SerializeObject(observation, Formatting.Indented);
                System.IO.File.WriteAllText(filePath, updatedJson);

                return Ok("Observation data updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating file: {ex.Message}");
            }
        }
    }
}
