const router = require('express').Router();
const sequelize = require('../../config/connection');

// The `/api/categories` endpoint
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
      attributes: {
        include: [
          [
            // be sure to include its associated Products
            sequelize.literal(
              '(CREATE VIEW [Categories] AS SELECT category_id, product_name FROM Product)'
            ),
            'Categories & Associated Products',
          ],
        ],
      },
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try{
  const categoryData = await Category.findbyPk(req.params.id, {
    include: [{ model: Product }],
    attributes: {
      include: [
        [
          sequelize.literal(
            // be sure to include its associated Products
            '(CREATE VIEW [Categories] AS SELECT category_id, product_name FROM Product)'
          ),
          'Categories & Associated Products',
        ],
      ],
    },
  });

  if (!categoryData) {
    res.status(404).json({ message: 'No prodcuts found with that id' });
    return;
  }

  res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  const categoryData = await Category.create(req.body);

  return res.json(categoryData);
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  const categoryData = await Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );

  return res.json(categoryData);
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const categoryData = await Category.destroy({
    where: {
      id: req.params.id,
    },
  });

  return res.json(categoryData);
});

module.exports = router;
