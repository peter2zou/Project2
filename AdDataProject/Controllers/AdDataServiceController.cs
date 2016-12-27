using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AdDataProject.AdDataService;


namespace AdDataProject.Controllers
{
    public class AdDataServiceController : ApiController
    {
        [Route("api/AdDataService/GetAll")]
        public IEnumerable<AdItem> GetAll()
        {
            return GetSampleAdData().AsEnumerable<AdItem>();
        }

        [Route("api/AdDataService/GetCover")]
        public IEnumerable<AdItem> GetCover()
        {
            return GetSampleAdData().Where(r => r.Position == "Cover" && r.NumPages >= (decimal)0.5).AsEnumerable<AdItem>();
        }

        [Route("api/AdDataService/GetTop5Ads")]
        public IEnumerable<AdItem> GetTop5Ads()
        {
            return GetSampleAdData().GroupBy(r => new { r.AdId, r.BrandId, r.BrandName })
            .Select(g =>
                   new AdItem
                   {
                       AdId = g.Key.AdId,
                       BrandId = g.Key.BrandId,
                       BrandName = g.Key.BrandName,
                       NumPages = g.Sum(i => i.NumPages),
                       Position = ""
                   })
             .OrderByDescending(r => r.NumPages)
             .ThenBy(r => r.AdId)
             .ThenBy(r => r.BrandName).AsEnumerable<AdItem>(); ;
        }

        [Route("api/AdDataService/GetTop5ByBrands")]
        public IEnumerable<AdItem> GetTop5ByBrands()
        {
            return GetSampleAdData().GroupBy(r => new { r.BrandName, r.BrandId })
            .Select(g =>
                   new AdItem
                   {
                       AdId = 0,
                       BrandId = g.Key.BrandId,
                       BrandName = g.Key.BrandName,
                       NumPages = g.Sum(i => i.NumPages),
                       Position = ""
                   })
             .OrderByDescending(r => r.NumPages)
             .ThenBy(r => r.BrandName).Take(5).AsEnumerable<AdItem>();
        }

        private List<AdItem> GetSampleAdData()
        {
            AdDataServiceClient adDataServiceClient = new AdDataServiceClient();
            var Ads = adDataServiceClient.GetAdDataByDateRange(new DateTime(2011, 1, 1), new DateTime(2011, 4, 1)).AsEnumerable<Ad>();
            var adItems = from ad in Ads
                            select new AdItem { AdId = ad.AdId, BrandId = ad.Brand.BrandId, BrandName = ad.Brand.BrandName, NumPages = ad.NumPages, Position = ad.Position };
            return adItems.ToList<AdItem>();
        }
    }
    public class AdItem
    {
        public int AdId{set;get;}
        public int BrandId{set; get;}
        public string BrandName { set; get; }
        public decimal NumPages { set; get; }
        public string Position { set; get; }
    }
}
